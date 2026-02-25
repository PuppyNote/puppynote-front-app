import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, Text, Calendar, FloatingActionButton, AlarmManagementModal, WalkDetailModal } from '../../components';
import { walkService, WalkHistory } from '../../services/walk/WalkService';
import { storageService } from '../../services/auth/StorageService';
import { formatToLocalDate, formatToLocalYearMonth } from '../../utils/DateUtil';

const WalkCard = ({ walk, onPress }: { walk: WalkHistory, onPress: (id: number) => void }) => {
  const startTime = new Date(walk.startTime);
  const endTime = new Date(walk.endTime);
  
  const timeStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(walk.walkId)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderInfo}>
          {walk.photoUrl ? (
            <Image source={{ uri: walk.photoUrl }} style={styles.walkImage} />
          ) : (
            <View style={[styles.walkImage, { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 24 }}>🐕</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.walkTitle}>{walk.location}</Text>
            <Text style={styles.walkTime}>{timeStr}</Text>
            {walk.memo ? <Text style={styles.walkMemo} numberOfLines={2}>{walk.memo}</Text> : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const WalkManagementScreen = ({ navigation }: any) => {
  const [isAlarmModalVisible, setIsAlarmModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedWalkId, setSelectedWalkId] = useState<number | null>(null);
  const [walkDates, setWalkDates] = useState<number[]>([]);
  const [walkHistory, setWalkHistory] = useState<WalkHistory[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    fetchCalendarData(now.getFullYear(), now.getMonth() + 1);
    fetchWalkHistory(now);
  }, []);

  const fetchCalendarData = async (year: number, month: number) => {
    try {
      const selectedPet = await storageService.getSelectedPet();
      if (!selectedPet) return;

      const yearMonth = formatToLocalYearMonth(year, month);
      const data = await walkService.getWalkCalendar(selectedPet.id, yearMonth);
      
      const datesWithWalk = data
        .filter(item => item.hasWalk)
        .map(item => parseInt(item.date.split('-')[2], 10));
      
      setWalkDates(datesWithWalk);
    } catch (error) {
      console.log('Error fetching calendar data:', error);
    }
  };

  const fetchWalkHistory = async (date: Date) => {
    setIsLoading(true);
    try {
      const selectedPet = await storageService.getSelectedPet();
      if (!selectedPet) return;

      const formattedDate = formatToLocalDate(date);
      
      const data = await walkService.getWalkHistory(selectedPet.id, formattedDate);
      setWalkHistory(data);
    } catch (error) {
      console.log('Error fetching walk history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchWalkHistory(date);
  };

  const handleWalkPress = (id: number) => {
    setSelectedWalkId(id);
    setIsDetailModalVisible(true);
  };

  return (
    <Layout>
      <View style={styles.topSection}>
        <TouchableOpacity 
          style={styles.alarmManageButton}
          onPress={() => setIsAlarmModalVisible(true)}
        >
          <View style={styles.alarmIconContainer}>
            <Text style={styles.alarmIcon}>⏰</Text>
          </View>
          <View>
            <Text style={styles.alarmManageTitle}>알림 관리</Text>
            <Text style={styles.alarmManageSub}>산책 및 일과 알림을 관리하세요</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.mainContent}>
          <Calendar 
            walkDates={walkDates}
            onMonthChange={fetchCalendarData}
            onDateSelect={handleDateSelect}
          />

          {isLoading ? (
            <ActivityIndicator color="#eebd2b" size="large" style={{ marginTop: 20 }} />
          ) : walkHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>이 날은 산책 기록이 없어요 🐾</Text>
            </View>
          ) : (
            walkHistory.map((walk) => (
              <WalkCard key={walk.walkId} walk={walk} onPress={handleWalkPress} />
            ))
          )}
        </ScrollView>
      </View>
      <FloatingActionButton onPress={() => navigation.navigate('AddWalk')} />

      <AlarmManagementModal 
        visible={isAlarmModalVisible}
        onClose={() => setIsAlarmModalVisible(false)}
      />

      <WalkDetailModal 
        visible={isDetailModalVisible}
        walkId={selectedWalkId}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedWalkId(null);
        }}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  alarmManageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  alarmIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmIcon: {
    fontSize: 24,
  },
  alarmManageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  alarmManageSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardHeaderInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  walkImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  walkTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  walkLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  walkTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  walkMemo: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default WalkManagementScreen;
