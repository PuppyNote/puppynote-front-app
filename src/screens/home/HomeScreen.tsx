import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import {
  Layout,
  Card,
  ActivityItem,
  Text,
} from '../../components';

export default function HomeScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <Layout>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.mb24}>
          <View style={styles.cardHeader}>
            <View style={styles.rowCenter}>
              <View style={styles.iconContainer}>
                <Text style={styles.walkIcon}>🚶</Text>
              </View>
              <Text style={styles.cardTitle}>산책 일정</Text>
            </View>
            <View style={styles.nextWalkBadge}>
              <Text style={styles.nextWalkBadgeText}>14:30 PM</Text>
            </View>
          </View>
          <View style={styles.profileRow}>
            <View style={styles.profileImageBorder}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo4RaKYrDo53w-hlMwsCvFNFfxl48s5ZtDRjKRpS5uB23ANcl8Q3aUz86pA_gmntrTMwbpUzicU2okQeVF1F77u9_J76WK2AcOcB0DAdfm5NSbuH1eHguFRQfD__wXcoguqzzKVC44zrcrjYOfOYmVG4lzCYo02p_iL8OI5m-7rUF4tQzw1DmnoxmSrVZ3T0Whbua3HbvvkcEvH1AGDsJM7otqKfuSJD_62_bCtT9Jhvz5xAlE5Zg-5qLJFSo3F3GizyLMsT-lwIA' }}
                style={styles.fullImage}
              />
            </View>
            <View>
              <Text style={styles.profileTitle}>Toby가 기다리고 있어요!</Text>
              <Text style={styles.profileSubtitle}>공원에서 30분 세션이 계획되어 있습니다</Text>
            </View>
          </View>
        </Card>

        <View style={styles.mb24}>
          <Text style={styles.sectionTitle}>활동 피드</Text>
          <ActivityItem icon="🍖" title="아침 식사" subtitle="8:00 AM • 모두 완료" time="2시간 전" color="#f0fdf4" iconColor="#22c55e" />
          <ActivityItem icon="💊" title="비타민" subtitle="7:30 AM • 일일 보충제" time="2.5시간 전" color="#faf5ff" iconColor="#a855f7" />
          <ActivityItem icon="😴" title="수면" subtitle="11:00 PM - 7:00 AM • 8시간" time="어제" color="#fff7ed" iconColor="#f97316" />
        </View>

        <View style={styles.tipCard}>
          <View style={styles.row}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.flex1}>
              <Text style={styles.tipTitle}>오늘의 팁</Text>
              <Text style={styles.tipText}>
                Toby는 오늘 매우 활발하게 활동했습니다! 충분한 물을 마시고 저녁에는 조용히 휴식을 취하도록 하세요.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  mb24: {
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  walkIcon: {
    color: '#3b82f6',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  nextWalkBadge: {
    backgroundColor: '#eebd2b1a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  nextWalkBadgeText: {
    color: '#eebd2b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileImageBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#eebd2b',
    overflow: 'hidden',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  profileSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  buttonYellow: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#eebd2b',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#f59e0b1a',
    borderWidth: 1,
    borderColor: '#f59e0b33',
    borderRadius: 16,
    padding: 16,
    marginBottom: 128,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  tipIcon: {
    color: '#f59e0b',
  },
  tipTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#f59e0b',
  },
  tipText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
});


