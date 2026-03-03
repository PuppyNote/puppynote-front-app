import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import {
  Layout,
  Card,
  ActivityItem,
  Text,
  Badge,
} from '../../components';
import { storageService } from '../../services/auth/StorageService';
import { petService } from '../../services/pet/PetService';
import { walkService } from '../../services/walk/WalkService';
import { petItemService } from '../../services/petItem/PetItemService';
import { homeService, HomeInfo } from '../../services/home/HomeService';
import { petTipService } from '../../services/petTip/PetTipService';
import { PetItem } from '../../types/PetItem';
import { calculateDaysDifference } from '../../utils/DateUtil';

export default function HomeScreen({ navigation }: any) {
  const [selectedPet, setSelectedPet] = useState<{ id: number; name: string } | null>(null);
  const [homeInfo, setHomeInfo] = useState<HomeInfo | null>(null);
  const [urgentSupplies, setUrgentSupplies] = useState<PetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTip, setCurrentTip] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const pet = await storageService.getSelectedPet();
      if (!pet) {
        setIsLoading(false);
        return;
      }
      setSelectedPet(pet);

      // 1. 홈 기본 정보 API 연동
      const info = await homeService.getHomeInfo(pet.id);
      setHomeInfo(info);

      // 2. 랜덤 팁 API 연동
      const tipData = await petTipService.getRandomPetTip();
      setCurrentTip(tipData.content);

      // 3. 소진 임박 용품 가져오기 (7일 이내)
      // 이 부분은 기존처럼 전체 목록을 가져와 필터링하거나, 백엔드에 전용 API가 필요하지만
      // 지금은 일단 기존 로직을 유지하면서 홈 카드의 카운트만 API 값으로 대체합니다.
      const itemData = await petItemService.getPetItems(pet.id);
      if (Array.isArray(itemData)) {
        const urgent = itemData.filter(item => {
          if (!item.nextPurchaseAt) return false;
          const diff = calculateDaysDifference(item.nextPurchaseAt);
          return diff <= 7;
        });
        setUrgentSupplies(urgent.slice(0, 3));
      }
    } catch (error) {
      console.error('Home data load error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  if (isLoading && !isRefreshing) {
    return (
      <Layout style={styles.center}>
        <ActivityIndicator color="#eebd2b" size="large" />
      </Layout>
    );
  }

  return (
    <Layout edges={['left', 'right']} backgroundColor="#fcfaf2">
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} color="#eebd2b" />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>안녕하세요, 집사님! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            {selectedPet ? `${selectedPet.name}와(과) 함께하는 즐거운 하루 되세요.` : '반려동물을 등록하고 관리를 시작해보세요.'}
          </Text>
        </View>

        {/* Status Overview Card */}
        <Card style={styles.mainCard}>
          <View style={styles.petInfoRow}>
            <View style={styles.petImageContainer}>
              <View style={styles.petImagePlaceholder}>
                {homeInfo?.petProfileImageUrl ? (
                  <Image 
                    source={{ uri: homeInfo.petProfileImageUrl }} 
                    style={styles.petImage} 
                  />
                ) : (
                  <Text style={styles.petEmoji}>🐶</Text>
                )}
              </View>
            </View>
            <View style={styles.petStatusInfo}>
              <Text style={styles.petNameText}>{homeInfo?.petName || selectedPet?.name || '우리 강아지'}</Text>
              <Text style={styles.petSubtitleText}>오늘도 즐거운 하루 되세요! ✨</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={styles.statItem} 
              onPress={() => navigation.navigate('Walk')}
              activeOpacity={0.7}
            >
              <Text style={styles.statValue}>{homeInfo?.recentWalkCount ?? 0}</Text>
              <Text style={styles.statLabel}>최근 7일 산책</Text>
            </TouchableOpacity>
            <View style={styles.verticalDivider} />
            <TouchableOpacity 
              style={styles.statItem} 
              onPress={() => navigation.navigate('Supplies')}
              activeOpacity={0.7}
            >
              <Text style={styles.statValue}>{homeInfo?.petItemCount ?? 0}</Text>
              <Text style={styles.statLabel}>관리 용품</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Urgent Supplies Section */}
        {urgentSupplies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>소진 임박 용품 🦴</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Supplies')}>
                <Text style={styles.seeAll}>전체보기</Text>
              </TouchableOpacity>
            </View>
            {urgentSupplies.map((item) => {
              const diff = calculateDaysDifference(item.nextPurchaseAt);
              return (
                <TouchableOpacity 
                  key={item.petItemId} 
                  style={styles.supplyUrgentCard}
                  onPress={() => navigation.navigate('Supplies')}
                >
                  <View style={styles.supplyInfo}>
                    <Text style={styles.supplyName}>{item.name}</Text>
                    <Text style={styles.supplyDate}>
                      {diff < 0 ? '이미 소진되었습니다' : `${diff}일 후 소진 예정`}
                    </Text>
                  </View>
                  <Badge 
                    label={diff < 0 ? '소진' : `D-${diff}`} 
                    variant={diff <= 3 ? 'error' : 'warning'} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Dog Tip Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>오늘의 팁 💡</Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>💡</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipDescription}>{currentTip}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  mainCard: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 32,
    marginBottom: 32,
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  petInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  petImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#eebd2b',
    padding: 2,
  },
  petImagePlaceholder: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#fefce8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  petEmoji: {
    fontSize: 32,
  },
  petStatusInfo: {
    flex: 1,
  },
  petNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  petSubtitleText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  seeAll: {
    fontSize: 14,
    color: '#eebd2b',
    fontWeight: 'bold',
  },
  supplyUrgentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  supplyInfo: {
    flex: 1,
  },
  supplyName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 2,
  },
  supplyDate: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fef3c7',
    gap: 16,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tipDescription: {
    fontSize: 14,
    color: '#b45309',
    lineHeight: 20,
    fontWeight: '500',
  },
  footerSpacer: {
    height: 100,
  },
});
