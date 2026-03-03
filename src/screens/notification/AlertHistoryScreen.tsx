import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Layout, Text } from '../../components';
import { PagedFlatList } from '../../components/items/PagedFlatList';
import { alertHistoryService, AlertHistory } from '../../services/alertHistory/AlertHistoryService';
import { useAlert } from '../../hooks/useAlert';

export default function AlertHistoryScreen({ navigation }: any) {
  const [histories, setHistories] = useState<AlertHistory[]>([]);
  const { showSimpleAlert } = useAlert();

  const handleItemClick = async (item: AlertHistory) => {
    if (item.alertHistoryStatus === 'UNCHECKED') {
      try {
        await alertHistoryService.checkAlert(item.id);
        setHistories(prev => prev.map(h => 
          h.id === item.id ? { ...h, alertHistoryStatus: 'CHECKED' } : h
        ));
      } catch (error: any) {
        showSimpleAlert('오류', error.message || '알림 확인 처리에 실패했습니다.');
      }
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
});
