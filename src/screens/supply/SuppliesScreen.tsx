import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import Layout from '../../components/Layout';
import CategoryTab from '../../components/tabs/CategoryTab';
import SupplyItem from '../../components/items/SupplyItem';
import FloatingActionButton from '../../components/button/FloatingActionButton';
import { CustomText } from '../../components/CustomText';
import SuppliesDetailModal from '../../components/modal/SuppliesDetailModal';
import { usePet } from '../../context/PetContext';
import { petItemService } from '../../services/petItem/PetItemService';
import { PetItem } from '../../types/PetItem';
import { calculateDaysDifference } from '../../utils/DateUtil';

export default function SuppliesScreen({ navigation }: any) {
  const { selectedPet, isLoadingPet } = usePet();
  const [activeTab, setActiveTab] = useState('all');
  const [tabs, setTabs] = useState([{ id: 'all', label: '전체' }]);
  const [items, setItems] = useState<PetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Detail modal state
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const fetchItems = useCallback(async (petId: number, category?: string) => {
    try {
      setLoading(true);
      const data = await petItemService.getPetItems(petId, category === 'all' ? undefined : category);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch pet items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingPet && selectedPet) {
      fetchItems(selectedPet.id, activeTab);
    }
  }, [isLoadingPet, selectedPet?.id, activeTab, fetchItems]);

  const handleTabPress = (categoryId: string) => {
    setActiveTab(categoryId);
  };

  const onRefresh = useCallback(async () => {
    if (selectedPet) {
      setRefreshing(true);
      await fetchItems(selectedPet.id, activeTab);
      setRefreshing(false);
    }
  }, [selectedPet, activeTab, fetchItems]);

  const handleItemPress = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsDetailModalVisible(true);
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
    <Layout showPetTab={true}>
      <CategoryTab 
        activeTabId={activeTab} 
        onTabPress={handleTabPress} 
        categoryType="ITEM"
        onTabsChange={setTabs}
        onAddPress={() => navigation.navigate('CategoryManagement', { 
          categoryType: 'ITEM' 
        })}
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="#eebd2b" />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator color="#eebd2b" size="large" style={styles.loader} />
        ) : !selectedPet ? (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>반려동물을 등록해주세요 🐶</CustomText>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>등록된 용품이 없어요 🦴</CustomText>
          </View>
        ) : (
          items.map((item) => {
            const statusInfo = getStatusInfo(item.nextPurchaseAt);
            return (
              <SupplyItem 
                key={item.petItemId}
                title={item.name} 
                category={item.categoryName} 
                status={statusInfo.label} 
                statusVariant={statusInfo.variant} 
                image={item.imageUrl}
                onPress={() => handleItemPress(item.petItemId)}
              />
            );
          })
        )}
        <View style={styles.spacer} />
      </ScrollView>

      <FloatingActionButton onPress={() => navigation.navigate('AddSupply')} />

      <SuppliesDetailModal 
        visible={isDetailModalVisible}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedItemId(null);
        }}
        petItemId={selectedItemId}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  spacer: {
    height: 128,
  },
});
