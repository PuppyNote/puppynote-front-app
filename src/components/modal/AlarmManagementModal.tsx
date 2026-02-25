import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CustomText as Text } from '../CustomText';
import { TimePickerCard } from '../card/TimePickerCard';
import AlarmItem from '../items/AlarmItem';

interface Alarm {
  id: string;
  hour: string;
  minute: string;
  days: string[];
  enabled: boolean;
}

interface AlarmManagementModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AlarmManagementModal({
  visible,
  onClose,
}: AlarmManagementModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', hour: '08', minute: '30', days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], enabled: true },
    { id: '2', hour: '18', minute: '00', days: ['SAT', 'SUN'], enabled: false },
  ]);

  const handleSaveAlarm = (data: any) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      ...data
    };
    setAlarms(prev => [...prev, newAlarm]);
    setIsAdding(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>알림 관리</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>

          {isAdding ? (
            <View style={styles.pickerWrapper}>
              <TimePickerCard 
                onSave={handleSaveAlarm} 
                onCancel={() => setIsAdding(false)} 
              />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setIsAdding(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.addIcon}>+</Text>
                <Text style={styles.addButtonText}>새로운 알림 추가</Text>
              </TouchableOpacity>

              {alarms.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>등록된 알림이 없습니다.</Text>
                  <Text style={styles.emptySubText}>위의 버튼을 눌러 추가해보세요!</Text>
                </View>
              ) : (
                alarms.map(alarm => (
                  <AlarmItem 
                    key={alarm.id}
                    {...alarm}
                    onToggle={toggleAlarm}
                    onDelete={deleteAlarm}
                  />
                ))
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '80%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#eebd2b',
    borderStyle: 'dashed',
    gap: 12,
  },
  addIcon: {
    fontSize: 24,
    color: '#eebd2b',
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eebd2b',
  },
  pickerWrapper: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
