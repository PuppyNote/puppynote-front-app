import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Layout, Text, CustomAlert } from '../../components';
import { PagedFlatList } from '../../components/items/PagedFlatList';
import { alertHistoryService, AlertHistory } from '../../services/alertHistory/AlertHistoryService';
import { familyService } from '../../services/family/FamilyService';
import { useAlert } from '../../hooks/useAlert';

export default function AlertHistoryScreen({ navigation }: any) {
  const [histories, setHistories] = useState<AlertHistory[]>([]);
  const { alertConfig, showAlert, showSimpleAlert, hideAlert } = useAlert();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleItemClick = async (item: AlertHistory) => {
    // 1. 읽음 처리 (아직 안 읽었을 경우)
    if (item.alertHistoryStatus === 'UNCHECKED') {
      try {
        await alertHistoryService.checkAlert(item.id);
        setHistories(prev => prev.map(h => 
          h.id === item.id ? { ...h, alertHistoryStatus: 'CHECKED' } : h
        ));
      } catch (error: any) {
        console.error('Failed to check alert:', error);
      }
    }

    // 2. 가족 초대 처리
    if (item.alertDestinationType === 'FAMILY_INVITE') {
      const inviterUserId = parseInt(item.alertDestinationInfo);
      
      if (isNaN(inviterUserId)) {
        showSimpleAlert('오류', '잘못된 초대 정보입니다.');
        return;
      }

      showAlert({
        title: '가족 초대 수락',
        message: '가족 초대를 수락하시겠습니까?\n수락하면 상대방의 반려동물을 함께 관리할 수 있습니다.',
        confirmText: '수락하기',
        cancelText: '취소',
        onConfirm: async () => {
          hideAlert();
          try {
            setIsProcessing(true);
            await familyService.registerFamily(inviterUserId);
            showSimpleAlert('성공', '가족 등록이 완료되었습니다! 🐾', () => {
              // 등록 성공 후 메인으로 이동
              navigation.navigate('MainTabs', { screen: 'Home' });
            });
          } catch (error: any) {
            showSimpleAlert('오류', error.message || '가족 등록에 실패했습니다.');
          } finally {
            setIsProcessing(false);
          }
        },
        onCancel: hideAlert,
      });
    }
  };

  const fetchHistories = useCallback(async (page: number) => {
    const response = await alertHistoryService.getAlertHistories(page, 12);
    return {
      content: response.content,
      totalPage: response.pageInfo.totalPage,
    };
  }, []);

  // renderItem을 useCallback으로 관리하여 리스트 리렌더링 최적화
  const renderItem = useCallback(({ item }: { item: AlertHistory }) => {
    const isUnchecked = item.alertHistoryStatus === 'UNCHECKED';
    
    return (
      <TouchableOpacity 
        style={[
          styles.itemContainer, 
          { borderLeftColor: isUnchecked ? '#eebd2b' : 'transparent' }
        ]}
        onPress={() => handleItemClick(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemHeader}>
          <View style={[styles.statusDot, { backgroundColor: isUnchecked ? '#eebd2b' : '#cbd5e1' }]} />
          <Text style={styles.itemDate}>{new Date(item.createdDate).toLocaleString()}</Text>
        </View>
        <Text style={styles.itemDescription}>{item.alertDescription}</Text>
      </TouchableOpacity>
    );
  }, [histories]); // histories가 바뀔 때만 renderItem 로직 갱신

  return (
    <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2">
      <PagedFlatList
        data={histories}
        onDataChange={setHistories}
        fetchData={fetchHistories}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        noItemsText="알림 내역이 없습니다."
        removeClippedSubviews={true} // 메모리 관리 최적화
      />

      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#eebd2b" />
        </View>
      )}

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
        type={alertConfig.type}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 24,
    paddingTop: 8,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    // 테두리 두께를 고정하여 읽음 처리 시 레이아웃이 튀는 현상 방지
    borderLeftWidth: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  itemDescription: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
