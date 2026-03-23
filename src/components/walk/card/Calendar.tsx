import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../../common/card/Card';
import { CustomText as Text } from '../../common/item/CustomText';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
  walkDates?: number[]; // 산책이 있는 날짜 배열 (예: [2, 5, 10])
  selectedDate?: Date; // 현재 선택된 날짜
}

export default function Calendar({ 
  onDateSelect, 
  onMonthChange, 
  walkDates = [],
  selectedDate = new Date()
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  
  const today = new Date();
  const isTodayMonth = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();
  
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDatePress = (day: number) => {
    onDateSelect?.(new Date(currentYear, currentMonth, day));
  };

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
        {calendarDays.map((day, i) => {
          if (!day) return <View key={i} style={styles.dayContainer} />;

          const isToday = isTodayMonth && day === today.getDate();
          
          // 선택된 날짜 여부 (연, 월, 일 일치 & 오늘 아님)
          const isSelected = selectedDate && 
                             selectedDate.getDate() === day && 
                             selectedDate.getMonth() === currentMonth && 
                             selectedDate.getFullYear() === currentYear &&
                             !isToday;

          const hasWalk = walkDates.includes(day);

          return (
            <TouchableOpacity 
              key={i} 
              style={styles.dayContainer}
              onPress={() => handleDatePress(day)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.dayCircle,
                isToday && styles.todayCircle,
                !isToday && hasWalk && styles.walkDayCircle,
                isSelected && styles.selectedCircle // 테두리만 덮어씌움
              ]}>
                <Text style={[
                  styles.dayText, 
                  isToday && styles.todayText,
                  !isToday && hasWalk && styles.walkDayText,
                  isSelected && styles.selectedDayText
                ]}>
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  todayCircle: {
    backgroundColor: '#eebd2b',
    borderColor: '#eebd2b',
  },
  selectedCircle: {
    borderColor: '#eebd2b',
    // backgroundColor를 설정하지 않아 기존 배경색 유지
  },
  walkDayCircle: {
    backgroundColor: '#fffbeb',
  },
  dayText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#eebd2b',
    fontWeight: 'bold',
  },
  walkDayText: {
    color: '#eebd2b',
    fontWeight: 'bold',
  },
});
