import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { CustomText } from '../CustomText';
import GlobalDetailModal from './GlobalDetailModal';
import Badge from '../badge/Badge';
import { petItemService } from '../../services/petItem/PetItemService';
import { PetItem } from '../../types/PetItem';
import { calculateDaysDifference } from '../../utils/DateUtil';

interface SuppliesDetailModalProps {
  visible: boolean;
  onClose: () => void;
  petItemId: number | null;
}

export default function SuppliesDetailModal({
  visible,
  onClose,
  petItemId,
}: SuppliesDetailModalProps) {
  const [item, setItem] = useState<PetItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && petItemId) {
      fetchDetail();
    } else {
      setItem(null);
    }
  }, [visible, petItemId]);

  const fetchDetail = async () => {
    if (!petItemId) return;
    try {
      setLoading(true);
      const data = await petItemService.getPetItemDetail(petItemId);
      setItem(data);
    } catch (error) {
      Alert.alert('오류', '상세 정보를 불러오는데 실패했습니다.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = async (url: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('알림', '구매 링크를 열 수 없습니다.');
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
            <Image source={{ uri: item.imageUrl }} style={styles.detailImage} />
            
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

            {item.purchaseUrl && (
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => handleOpenLink(item.purchaseUrl)}
              >
                <CustomText style={styles.linkButtonText}>🛒 구매하러 가기</CustomText>
              </TouchableOpacity>
            )}
            
            <View style={styles.modalSpacer} />
          </View>
        </ScrollView>
      ) : null}
    </GlobalDetailModal>
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
  detailImage: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    marginBottom: 24,
    backgroundColor: '#f1f5f9',
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
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalSpacer: {
    height: 40,
  },
});
