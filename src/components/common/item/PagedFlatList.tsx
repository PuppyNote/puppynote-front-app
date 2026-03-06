import React, { useState, useCallback, useEffect } from 'react';
import { 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  View, 
  StyleSheet, 
  FlatListProps 
} from 'react-native';
import { CustomText as Text } from './CustomText';

interface PagedFlatListProps<T> extends Omit<FlatListProps<T>, 'onRefresh' | 'onEndReached' | 'data'> {
  fetchData: (page: number) => Promise<{ content: T[], totalPage: number }>;
  noItemsText?: string;
  pageSize?: number;
  data?: T[];
  onDataChange?: (data: T[]) => void;
}

export function PagedFlatList<T>({ 
  fetchData, 
  noItemsText = '데이터가 없습니다.', 
  pageSize = 12,
  data: externalData,
  onDataChange,
  ...flatListProps 
}: PagedFlatListProps<T>) {
  const [internalItems, setInternalItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 외부 데이터가 있으면 그것을 사용, 없으면 내부 상태 사용
  const items = externalData !== undefined ? externalData : internalItems;
  const setItems = (newItems: T[] | ((prev: T[]) => T[])) => {
    if (onDataChange && externalData !== undefined) {
      const updated = typeof newItems === 'function' ? (newItems as any)(externalData) : newItems;
      onDataChange(updated);
    } else {
      setInternalItems(newItems);
    }
  };

  const loadData = useCallback(async (pageNum: number, refreshing: boolean = false) => {
    if (isLoading && !refreshing) return;
    
    setIsLoading(true);
    try {
      const response = await fetchData(pageNum);
      if (refreshing) {
        setItems(response.content);
      } else {
        setItems(prev => [...prev, ...response.content]);
      }
      setTotalPage(response.totalPage);
      setPage(pageNum);
    } catch (error) {
      console.error('PagedList fetch error:', error);
    } finally {
      setIsLoading(false);
      if (refreshing) setIsRefreshing(false);
    }
  }, [isLoading, fetchData, externalData, onDataChange]);

  useEffect(() => {
    loadData(1, true);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPage && !isLoading) {
      loadData(page + 1);
    }
  };

  return (
    <FlatList
      {...flatListProps}
      data={items}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={handleRefresh} 
          color="#eebd2b" 
        />
      }
      ListFooterComponent={() => 
        isLoading && !isRefreshing ? (
          <ActivityIndicator color="#eebd2b" style={styles.loader} />
        ) : null
      }
      ListEmptyComponent={() => (
        !isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{noItemsText}</Text>
          </View>
        ) : null
      )}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
});
