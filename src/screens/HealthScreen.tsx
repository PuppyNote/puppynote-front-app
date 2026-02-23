import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Layout from '../components/Layout';
import Card from '../components/Card';
import FloatingActionButton from '../components/FloatingActionButton';
import HealthItem from '../components/HealthItem';

export default function HealthScreen({ navigation }: any) {
  return (
    <Layout>
      <View style={styles.subTabs}>
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.tabTextActive}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.tabTextInactive}>Records</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab}>
            <Text style={styles.tabTextInactive}>Clinics</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarHeaderText}>October 2023</Text>
            <View style={styles.arrowRow}>
              <TouchableOpacity><Text style={styles.arrowText}>◀</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.arrowText}>▶</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.daysRow}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <Text key={day} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {[...Array(14)].map((_, i) => (
              <View key={i} style={styles.dayContainer}>
                <Text style={[styles.dayText, i === 7 && styles.activeDay]}>{i + 1}</Text>
                {i === 2 && <View style={styles.eventDot} />}
              </View>
            ))}
          </View>
        </Card>

        <HealthItem 
          title="Rabies Booster" 
          location="City Pet Clinic" 
          time="Tomorrow, 10:30 AM" 
          status="D-1" 
          statusVariant="error"
          icon="💉"
        />
        <HealthItem 
          title="Heartworm Pill" 
          location="Monthly Treatment" 
          time="Due in 5 days" 
          status="D-5" 
          statusVariant="warning"
          icon="💊"
        />
        <HealthItem 
          title="Weight Check" 
          location="Current: 12.4 lbs" 
          time="Completed: Oct 2" 
          status="Done" 
          statusVariant="neutral"
          icon="⚖️"
        />
        <View style={styles.spacer} />
      </ScrollView>

      <FloatingActionButton onPress={() => console.log('Add Health Record')} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  subTabs: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 24,
  },
  activeTab: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#eebd2b',
  },
  inactiveTab: {
    paddingBottom: 12,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tabTextInactive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  calendarCard: {
    marginBottom: 24,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  arrowRow: {
    flexDirection: 'row',
    gap: 16,
  },
  arrowText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    width: 32,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#0f172a',
  },
  activeDay: {
    fontWeight: 'bold',
    backgroundColor: '#eebd2b33',
    borderRadius: 999,
    color: '#eebd2b',
    width: 24,
    height: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 24,
  },
  eventDot: {
    width: 4,
    height: 4,
    backgroundColor: '#ef4444',
    borderRadius: 2,
    marginTop: 4,
  },
  spacer: {
    height: 128,
  },
});
