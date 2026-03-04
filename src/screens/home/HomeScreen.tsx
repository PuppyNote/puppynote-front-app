import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import {
  Layout,
  Card,
  Text,
  Badge,
  PetRegistrationModal,
} from '../../components';
import { storageService } from '../../services/auth/StorageService';
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
  const [isPetModalVisible, setIsPetModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. 랜덤 팁 API 연동 (펫 여부와 상관없이 항상 가져옴)
      try {
        const tipData = await petTipService.getRandomPetTip();
        setCurrentTip(tipData.content);
      } catch (error) {
        console.warn('Failed to fetch pet tip:', error);
      }

      const pet = await storageService.getSelectedPet();
      if (!pet) {
        setSelectedPet(null);
        setHomeInfo(null);
        setUrgentSupplies([]);
        setIsLoading(false);
        return;
      }
      setSelectedPet(pet);

      // 2. 홈 기본 정보 API 연동
      const info = await homeService.getHomeInfo(pet.id);
      setHomeInfo(info);

      // 3. 소진 임박 용품 가져오기 (7일 이내)
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

  const handlePetRegistrationSuccess = async (petId: number, petName: string) => {
    setIsPetModalVisible(false);
    await storageService.saveSelectedPet(petId, petName);
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
            {!selectedPet 
              ? '반려동물을 등록하고 PuppyNote를 시작해보세요!' 
              : homeInfo 
                ? (homeInfo.walkedToday 
                  ? '오늘 산책을 완료했어요! 정말 멋져요. ✨' 
                  : homeInfo.daysSinceLastWalk !== null 
                    ? `마지막 산책으로부터 ${homeInfo.daysSinceLastWalk}일이 지났어요.`
                    : '오늘도 즐거운 하루 되세요!')
                : '오늘도 즐거운 하루 되세요!'}
          </Text>
        </View>

        {!selectedPet ? (
          /* Empty Pet State Card */
          <TouchableOpacity 
            style={styles.emptyPetCard} 
            onPress={() => setIsPetModalVisible(true)}
            activeOpacity={0.9}
          >
            <View style={styles.emptyPetContent}>
              <View style={styles.emptyPetIconContainer}>
                <Text style={styles.emptyPetIcon}>🐶</Text>
              </View>
              <View style={styles.emptyPetInfo}>
                <Text style={styles.emptyPetTitle}>아직 등록된 아이가 없어요</Text>
                <Text style={styles.emptyPetSubtitle}>이곳을 눌러 우리 아이를 등록해주세요!</Text>
              </View>
              <View style={styles.plusBadge}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            {/* Status Overview Card */}
            <Card style={styles.mainCard}>
              <TouchableOpacity 
                style={styles.petInfoRow} 
                onPress={() => setIsPetModalVisible(true)}
                activeOpacity={0.7}
              >
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
                  <View style={styles.petNameRow}>
                    <Text style={styles.petNameText}>{homeInfo?.petName || selectedPet?.name}</Text>
                    {homeInfo?.petAge && <Text style={styles.petAgeText}>{homeInfo.petAge}</Text>}
                    <Text style={styles.editIcon}>✏️</Text>
                  </View>
                  <View style={styles.badgeRow}>
                    {homeInfo?.birthdayDday !== null && (
                      <Badge 
                        label={homeInfo?.birthdayDday === 0 ? '🎂 오늘 생일!' : `🎂 D-${homeInfo?.birthdayDday}`} 
                        variant="warning" 
                      />
                    )}
                    <Badge 
                      label={homeInfo?.walkedToday ? '오늘 산책 완료' : '산책 대기 중'} 
                      variant={homeInfo?.walkedToday ? 'success' : 'neutral'} 
                    />
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <View style={styles.statsRow}>
                <TouchableOpacity 
                  style={styles.statItem} 
                  onPress={() => navigation.navigate('Walk')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statValue}>{homeInfo?.recentWalkCount ?? 0}</Text>
                  <Text style={styles.statLabel}>최근 7일</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity 
                  style={styles.statItem} 
                  onPress={() => navigation.navigate('Walk')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statValue}>{homeInfo?.monthlyWalkMinutes ?? 0}</Text>
                  <Text style={styles.statLabel}>이달의 산책(분)</Text>
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

            {/* Walk Status Card */}
            {homeInfo && homeInfo.daysSinceLastWalk !== null && (
              <Card 
                style={[
                  styles.walkSummaryCard, 
                  homeInfo.daysSinceLastWalk <= 1 ? styles.borderSuccess : 
                  homeInfo.daysSinceLastWalk === 2 ? styles.borderWarning : 
                  styles.borderError
                ]}
              >
                <View style={styles.walkSummaryContent}>
                  <View>
                    <Text style={styles.walkSummaryLabel}>마지막 산책으로부터</Text>
                    <Text style={styles.walkSummaryValue}>
                      {homeInfo.daysSinceLastWalk === 0 ? '오늘 산책했어요! ✨' : `${homeInfo.daysSinceLastWalk}일 지났어요`}
                    </Text>
                  </View>
                  <View style={[
                    styles.walkStatusIndicator,
                    homeInfo.daysSinceLastWalk <= 1 ? styles.bgSuccess : 
                    homeInfo.daysSinceLastWalk === 2 ? styles.bgWarning : 
                    styles.bgError
                  ]}>
                    <Text style={styles.walkStatusIcon}>
                      {homeInfo.daysSinceLastWalk <= 1 ? '🐾' : 
                       homeInfo.daysSinceLastWalk === 2 ? '⚠️' : '🚨'}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          </>
        )}

        {/* Today's Alarms Section */}
        {homeInfo?.todayWalkAlarmTimes && homeInfo.todayWalkAlarmTimes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>오늘의 산책</Text>
            </View>
            <View style={styles.alarmListRow}>
              {homeInfo.todayWalkAlarmTimes.map((time, index) => (
                <View key={index} style={styles.alarmChip}>
                  <Text style={styles.alarmChipText}>{time.substring(0, 5)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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
            <Text style={styles.sectionTitle}>팁 💡</Text>
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

      <PetRegistrationModal
        visible={isPetModalVisible}
        onSuccess={handlePetRegistrationSuccess}
        onClose={() => setIsPetModalVisible(false)}
        petId={selectedPet?.id}
        initialData={selectedPet ? {
          name: homeInfo?.petName || selectedPet.name,
          imageUrl: homeInfo?.petProfileImageUrl || null,
          birthDate: homeInfo?.birthDate || null,
        } : null}
      />
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
    fontWeight: '500',
  },
  mainCard: {
    padding: 20,
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
    width: 72,
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
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 6,
  },
  petNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  petAgeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  editIcon: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  verticalDivider: {
    width: 1,
    height: 24,
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
  alarmListRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  alarmChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  alarmChipText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
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
  walkSummaryCard: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'white',
    borderRadius: 28,
    marginBottom: 32,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  walkSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walkSummaryLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 4,
  },
  walkSummaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  walkStatusIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walkStatusIcon: {
    fontSize: 22,
  },
  borderSuccess: { borderColor: '#22c55e' },
  borderWarning: { borderColor: '#f97316' },
  borderError: { borderColor: '#ef4444' },
  bgSuccess: { backgroundColor: '#f0fdf4' },
  bgWarning: { backgroundColor: '#fff7ed' },
  bgError: { backgroundColor: '#fef2f2' },
  emptyPetCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#eebd2b',
    borderStyle: 'dashed',
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyPetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emptyPetIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fffbeb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPetIcon: {
    fontSize: 32,
  },
  emptyPetInfo: {
    flex: 1,
  },
  emptyPetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  emptyPetSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  plusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eebd2b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
