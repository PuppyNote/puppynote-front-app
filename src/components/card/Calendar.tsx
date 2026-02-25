import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';
import { CustomText as Text } from '../CustomText';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
  walkDates?: number[]; // 산책이 있는 날짜 배열 (예: [2, 5, 10])
}

export default function Calendar({ onDateSelect, onMonthChange, walkDates = [] }: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  
  const today = new Date();
  const isTodayMonth = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setViewDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setViewDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
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
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
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
                  isTodayMonth && day === today.getDate() && styles.activeDay,
                  !(isTodayMonth && day === today.getDate()) && walkDates.includes(day) && styles.walkDay
                ]}>
                  {day}
                </Text>
                {walkDates.includes(day) && (
                  <View style={styles.indicatorContainer}>
                    <Text style={styles.pawIcon}>🐾</Text>
                  </View>
                )}
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
  walkDay: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    color: '#16a34a',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: -2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawIcon: {
    fontSize: 10,
    color: '#22c55e',
  },
});
