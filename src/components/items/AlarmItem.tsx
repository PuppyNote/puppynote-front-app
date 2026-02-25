import React from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { CustomText as Text } from '../CustomText';

export interface AlarmItemProps {
  id: string;
  hour: string;
  minute: string;
  days: string[];
  enabled: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
}

const daysLabel: { [key: string]: string } = {
  'MON': '월', 'TUE': '화', 'WED': '수', 'THU': '목', 'FRI': '금', 'SAT': '토', 'SUN': '일'
};

const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function AlarmItem({
  id,
  hour,
  minute,
  days,
  enabled,
  onToggle,
  onDelete,
  onPress,
}: AlarmItemProps) {
  return (
    <View style={styles.alarmItem}>
      <TouchableOpacity 
        style={styles.alarmInfo} 
        onPress={() => onPress(id)}
        activeOpacity={0.7}
      >
        <Text style={styles.alarmTime}>{hour}:{minute}</Text>
        <View style={styles.daysRow}>
          {dayOrder.map(day => (
            <Text 
              key={day} 
              style={[
                styles.daySmall, 
                days.includes(day) && styles.dayActive
              ]}
            >
              {daysLabel[day]}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
      <View style={styles.alarmActions}>
        <Switch
          trackColor={{ false: "#E9ECEF", true: "#FEE500" }}
          thumbColor={enabled ? "#fff" : "#f4f3f4"}
          onValueChange={() => onToggle(id)}
          value={enabled}
        />
        <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alarmItem: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
  },
  daySmall: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  dayActive: {
    color: '#eebd2b',
  },
  alarmActions: {
    alignItems: 'flex-end',
    gap: 12,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
});
