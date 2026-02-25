import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, Text, Calendar, FloatingActionButton, AlarmManagementModal } from '../../components';
import { walkService } from '../../services/walk/WalkService';
import { storageService } from '../../services/auth/StorageService';

// Mock data for walks
const walks = [
  {
    id: '1',
    title: '아침 산책',
    location: '중앙 공원',
    time: '오늘, 08:30 AM',
    status: '지금',
    statusColor: '#ff6b6b',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQngR7iBTWfN8h-0vz34AlWfv1h-cleScZfne4pEM_pdGvyA4T4am7CBdbyx1b9kn_6zVQE0_JQ_BbnkYhNZRNqvYe4vv342gZdkpSzOzY_VHwJTeUIkf45wwV-O9vHZayYbGUYQXrfqp1PWbFakO6REPrdCizv1iqaeyG-C5UCcpA09nuJHe-vixH7ftyjayhVJNsh3EVExmZPLGhjhU14-4371Xp3ZmpdJI3OGcGdcjI80EVXdk7Zql25uOT40Ef0BEZCAHQ8ko'
  },
  {
    id: '2',
    title: '저녁 산책',
    location: '강변 산책로',
    time: '오늘, 06:00 PM',
    status: '4시간 후',
    statusColor: '#f59e0b',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnB44Nhvj4H02Wo4ZS72w9ekAz3y6KjryST4Y535suUIXVNASEqLSrCEkrVPslIVoRciP1mbo6sHLeqqWGuWlq07pXs8UAsmFaz3E_xjr_hW8iw6ylyz0J7XgRBnML4Ui89FacStfo4pWXLnNsfkTAoikQgUraUNf4qHDI1i9PhAgtAEOn9gCS7D-q_DhrPQkiiT34JHigV4MqEAQHBXIHwRjIAqn-LZWNlp5xLH6zNWJOw4b7h1i8oGZw5cm8Rd-KAjqK8LxjHGI'
  },
  {
    id: '3',
    title: '오후 달리기',
    location: '강아지 공원',
    time: '어제, 02:15 PM',
    status: '완료',
    statusColor: '#6b7280',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSw-YVsazmsAxslAoER0np_8AHYGHowWtt1e7VFcv0KfVJsfiSITuNJhBnLqgd1_T8mnrg9kjihGwPyFGhBEDtKI-JLO5y-h5_D_UPRp0ahtJLo0xYJ3BRW1raiiT1K5rGEDfLHUWrwHSd-3t8g69ng1y2QX9Ys2585re9yh91D0keMybigFR382clgRBPkvUTqvJMIv2oCnON1x7zn6krEebjlUTG4vn6oHAuZ9jUYA9k9SB8WS-AsSVyaOBekT6t_aVxSznaYSE'
  },
];

const WalkCard = ({ walk }: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderInfo}>
        <Image source={{ uri: walk.image }} style={styles.walkImage} />
        <View>
          <Text style={styles.walkTitle}>{walk.title}</Text>
          <Text style={styles.walkLocation}>{walk.location}</Text>
          <Text style={styles.walkTime}>{walk.time}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${walk.statusColor}1A`, borderColor: `${walk.statusColor}33` }]}>
        <Text style={[styles.statusText, { color: walk.statusColor }]}>{walk.status}</Text>
      </View>
    </View>
  </View>
);

const WalkManagementScreen = ({ navigation }: any) => {
  const [isAlarmModalVisible, setIsAlarmModalVisible] = useState(false);
  const [walkDates, setWalkDates] = useState<number[]>([]);

  useEffect(() => {
    const now = new Date();
    fetchCalendarData(now.getFullYear(), now.getMonth() + 1);
  }, []);

  const fetchCalendarData = async (year: number, month: number) => {
    try {
      const selectedPet = await storageService.getSelectedPet();
      if (!selectedPet) return;

      const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
      const data = await walkService.getWalkCalendar(selectedPet.id, yearMonth);
      
      const datesWithWalk = data
        .filter(item => item.hasWalk)
        .map(item => parseInt(item.date.split('-')[2], 10));
      
      setWalkDates(datesWithWalk);
    } catch (error) {
      console.log('Error fetching calendar data:', error);
    }
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
          />
          {walks.map((walk) => (
            <WalkCard key={walk.id} walk={walk} />
          ))}
        </ScrollView>
      </View>
      <FloatingActionButton onPress={() => navigation.navigate('AddWalk')} />

      <AlarmManagementModal 
        visible={isAlarmModalVisible}
        onClose={() => setIsAlarmModalVisible(false)}
      />
    </Layout>
  );
};

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
    marginTop: 4,
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
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#eebd2b',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#111827',
    fontWeight: 'bold',
  },
});

export default WalkManagementScreen;
