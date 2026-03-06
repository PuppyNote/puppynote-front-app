import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CustomText } from '../../common/item/CustomText';
import GlobalDetailModal from '../../common/modal/GlobalDetailModal';
import Badge from '../../common/item/Badge';
import { petItemService, PurchaseHistory } from '../../../services/petItem/PetItemService';
import { PetItem } from '../../../types/PetItem';
import { calculateDaysDifference } from '../../../utils/DateUtil';
import CustomAlert from '../../common/modal/CustomAlert';
import { useAlert } from '../../../hooks/useAlert';

interface SuppliesDetailModalProps {
  visible: boolean;
  onClose: () => void;
  petItemId: number | null;
  onRefreshList?: () => void;
}

export default function SuppliesDetailModal({
  visible,
  onClose,
  petItemId,
  onRefreshList,
}: SuppliesDetailModalProps) {
  const navigation = useNavigation<any>();
  const { alertConfig, showSimpleAlert, showConfirmAlert, hideAlert } = useAlert();
  const [item, setItem] = useState<PetItem | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible && petItemId) {
      loadData();
    } else {
      setItem(null);
      setPurchaseHistory([]);
    }
  }, [visible, petItemId]);

  const loadData = async () => {
    if (!petItemId) return;
    try {
      setLoading(true);
      const [detailData, historyData] = await Promise.all([
        petItemService.getPetItemDetail(petItemId),
        petItemService.getPurchaseHistory(petItemId)
      ]);
      setItem(detailData);
      setPurchaseHistory(historyData);
    } catch (error) {
      showSimpleAlert('오류', '데이터를 불러오는데 실패했습니다.', onClose);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPurchase = async () => {
    if (!petItemId) return;
    try {
      setIsSubmitting(true);
      await petItemService.createPurchase(petItemId);
      showSimpleAlert('성공', '구매 기록이 등록되었습니다.');
      
      // 데이터 갱신
      const [detailData, historyData] = await Promise.all([
        petItemService.getPetItemDetail(petItemId),
        petItemService.getPurchaseHistory(petItemId)
      ]);
      setItem(detailData);
      setPurchaseHistory(historyData);
      
      // 목록 화면도 갱신이 필요할 경우 호출
      if (onRefreshList) onRefreshList();
    } catch (error) {
      showSimpleAlert('오류', '구매 기록 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (!item) return;
    onClose();
    navigation.navigate('AddSupply', { editItem: item });
  };

  const handleDelete = () => {
    showConfirmAlert(
      '용품 삭제',
      '정말로 이 용품을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.',
      async () => {
        if (!petItemId) return;
        try {
          setIsSubmitting(true);
          await petItemService.deletePetItem(petItemId);
          if (onRefreshList) onRefreshList();
          onClose();
        } catch (error) {
          showSimpleAlert('오류', '용품 삭제에 실패했습니다.');
        } finally {
          setIsSubmitting(false);
        }
      }
    );
  };

  const handleOpenLink = async (url: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      showSimpleAlert('알림', '구매 링크를 열 수 없습니다.');
    }
  };

  const getStatusInfo = (nextPurchaseAt: string) => {
    if (!nextPurchaseAt) return { label: '미구매 항목', variant: 'neutral' as const };

    const daysLeft = calculateDaysDifference(nextPurchaseAt);

    if (daysLeft < 0) {
      return { label: `소진됨 (${Math.abs(daysLeft)}일 경과)`, variant: 'error' as const };
    } else if (daysLeft === 0) {
      return { label: '오늘 소진 예정', variant: 'error' as const };
    } else if (daysLeft <= 3) {
      return { label: `${daysLeft}일 후 소진 예정`, variant: 'error' as const };
    } else if (daysLeft <= 7) {
      return { label: `${daysLeft}일 후 소진 예정`, variant: 'warning' as const };
    } else {
      return { label: '재고 충분', variant: 'success' as const };
    }
  };

  return (
    <>
      <GlobalDetailModal
        visible={visible}
        onClose={onClose}
        title="용품 상세 정보"
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#eebd2b" />
          </View>
        ) : item ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailContainer}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.imageUrl }} style={styles.detailImage} />
                <View style={styles.actionButtonsOverlay}>
                  <TouchableOpacity style={styles.iconButton} onPress={handleEdit}>
                    <CustomText style={styles.iconText}>✏️</CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.iconButton, styles.deleteIconButton]} onPress={handleDelete}>
                    <CustomText style={styles.iconText}>🗑️</CustomText>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.detailHeader}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <CustomText style={styles.detailTitle}>{item.name}</CustomText>
                  <CustomText style={styles.detailCategory}>{item.majorCategoryName} › {item.categoryName}</CustomText>
                </View>
                <Badge 
                  label={getStatusInfo(item.nextPurchaseAt).label} 
                  variant={getStatusInfo(item.nextPurchaseAt).variant} 
                />
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <CustomText style={styles.infoLabel}>구매 주기</CustomText>
                  <CustomText style={styles.infoValue}>{item.purchaseCycleDays}일 마다</CustomText>
                </View>
                <View style={styles.infoRow}>
                  <CustomText style={styles.infoLabel}>최근 구매일</CustomText>
                  <CustomText style={styles.infoValue}>{item.lastPurchasedAt || '기록 없음'}</CustomText>
                </View>
                <View style={styles.infoRow}>
                  <CustomText style={styles.infoLabel}>다음 구매 예정</CustomText>
                  <CustomText style={styles.infoValue}>{item.nextPurchaseAt || '기록 없음'}</CustomText>
                </View>
              </View>

              {/* Purchase Registration Button */}
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegisterPurchase}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <CustomText style={styles.registerButtonText}>✨ 오늘 구매 등록</CustomText>
                )}
              </TouchableOpacity>

              {item.purchaseUrl && (
                <TouchableOpacity 
                  style={styles.linkButton} 
                  onPress={() => handleOpenLink(item.purchaseUrl)}
                >
                  <CustomText style={styles.linkButtonText}>🛒 구매 링크 열기</CustomText>
                </TouchableOpacity>
              )}

              {/* Purchase History Section */}
              <View style={styles.historySection}>
                <CustomText style={styles.historyTitle}>구매 이력</CustomText>
                {purchaseHistory.length > 0 ? (
                  purchaseHistory.map((history) => (
                    <View key={history.id} style={styles.historyItem}>
                      <View style={styles.historyDot} />
                      <CustomText style={styles.historyDate}>{history.purchasedAt}</CustomText>
                      <CustomText style={styles.historyLabel}>구매 완료</CustomText>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyHistory}>
                    <CustomText style={styles.emptyHistoryText}>아직 구매 이력이 없습니다.</CustomText>
                  </View>
                )}
              </View>
              
              <View style={styles.modalSpacer} />
            </View>
          </ScrollView>
        ) : null}
      </GlobalDetailModal>
      
      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={hideAlert}
        type={alertConfig.type}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContainer: {
    paddingBottom: 24,
  },
  imageWrapper: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    marginBottom: 24,
    backgroundColor: '#f1f5f9',
    position: 'relative',
    overflow: 'hidden',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  actionButtonsOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteIconButton: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
  },
  iconText: {
    fontSize: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  detailCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  linkButton: {
    backgroundColor: '#eebd2b',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  historySection: {
    marginTop: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#eebd2b',
    marginRight: 12,
  },
  historyDate: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  historyLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  emptyHistory: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyHistoryText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  modalSpacer: {
    height: 40,
  },
});
