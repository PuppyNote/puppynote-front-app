import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';
import { CustomText as Text } from '../CustomText';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  events?: number[]; // 이벤트를 표시할 날짜 배열 (예: [5, 15, 24])
}

export default function Calendar({ onDateSelect, events = [5, 15, 24] }: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  
  const today = new Date();
  const isTodayMonth = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarHeaderText}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <View style={styles.arrowRow}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.daysRow}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <Text key={day} style={styles.dayLabel}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarDays.map((day, i) => (
          <TouchableOpacity 
            key={i} 
            style={styles.dayContainer}
            disabled={!day}
            onPress={() => day && onDateSelect?.(new Date(currentYear, currentMonth, day))}
          >
            {day && (
              <>
                <Text style={[
                  styles.dayText, 
                  isTodayMonth && day === today.getDate() && styles.activeDay
                ]}>
                  {day}
                </Text>
                {events.includes(day) && <View style={styles.eventDot} />}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    marginBottom: 24,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#0f172a',
  },
  arrowRow: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  arrowText: {
    color: '#64748b',
    fontSize: 12,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    width: '14.28%',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayContainer: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#334155',
    width: 28,
    height: 28,
    textAlign: 'center',
    lineHeight: 28,
  },
  activeDay: {
    fontWeight: 'bold',
    backgroundColor: '#eebd2b',
    borderRadius: 14,
    color: 'white',
    overflow: 'hidden',
  },
  eventDot: {
    width: 4,
    height: 4,
    backgroundColor: '#ef4444',
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
});
