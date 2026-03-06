import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { CustomText as Text } from '../../common/item/CustomText';
import { TimePickerCard } from '../../common/card/TimePickerCard';
import { petWalkAlarmService, WalkAlarm } from '../../../services/petWalkAlarm/PetWalkAlarmService';
import { storageService } from '../../../services/auth/StorageService';
import { AlarmStatus } from '../../../types/enums';
import AlarmItem from '../item/AlarmItem';
import CustomAlert from '../../common/modal/CustomAlert';
import GlobalDetailModal from '../../common/modal/GlobalDetailModal';
import { useAlert } from '../../../hooks/useAlert';

interface AlarmManagementModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AlarmManagementModal({
  visible,
  onClose,
}: AlarmManagementModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingAlarmId, setEditingAlarmId] = useState<number | null>(null);
  const [alarms, setAlarms] = useState<WalkAlarm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [petId, setPetId] = useState<number | null>(null);
  const { alertConfig, showAlert } = useAlert();

  useEffect(() => {
    if (visible) {
      loadInitialData();
    } else {
      setIsAdding(false);
    }
  }, [visible]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const selectedPet = await storageService.getSelectedPet();
      if (selectedPet) {
        setPetId(selectedPet.id);
        const fetchedAlarms = await petWalkAlarmService.getWalkAlarms(selectedPet.id);
        setAlarms(fetchedAlarms);
      }
    } catch (error) {
      console.log('Error loading alarms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAlarm = async (data: any) => {
    if (!petId) return;

    setIsLoading(true);
    try {
      if (editingAlarmId) {
        await petWalkAlarmService.updateWalkAlarm({
          alarmId: editingAlarmId,
          alarmStatus: data.enabled ? AlarmStatus.YES : AlarmStatus.NO,
          alarmDays: data.days,
          alarmTime: `${data.hour}:${data.minute}`,
        });
      } else {
        await petWalkAlarmService.createWalkAlarm({
          petId,
          alarmStatus: data.enabled ? AlarmStatus.YES : AlarmStatus.NO,
          alarmDays: data.days,
          alarmTime: `${data.hour}:${data.minute}`,
        });
      }
      
      // Reload list
      const fetchedAlarms = await petWalkAlarmService.getWalkAlarms(petId);
      setAlarms(fetchedAlarms);
      setIsAdding(false);
      setEditingAlarmId(null);
    } catch (error: any) {
      showAlert('오류', error.message || '알람 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPress = (id: string) => {
    setEditingAlarmId(parseInt(id, 10));
    setIsAdding(true);
  };

  const toggleAlarm = async (id: string) => {
    const alarm = alarms.find(a => a.alarmId.toString() === id);
    if (!alarm) return;

    const newStatus = alarm.alarmStatus === AlarmStatus.YES ? AlarmStatus.NO : AlarmStatus.YES;
    
    setIsLoading(true);
    try {
      await petWalkAlarmService.updateWalkAlarmStatus(alarm.alarmId, newStatus);
      setAlarms(prev => prev.map(a => 
        a.alarmId === alarm.alarmId ? { ...a, alarmStatus: newStatus } : a
      ));
    } catch (error: any) {
      showAlert('오류', error.message || '상태 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAlarm = async (id: string) => {
    setIsLoading(true);
    try {
      await petWalkAlarmService.deleteWalkAlarm(parseInt(id, 10));
      setAlarms(prev => prev.filter(alarm => alarm.alarmId.toString() !== id));
    } catch (error: any) {
      showAlert('오류', error.message || '알람 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlobalDetailModal
      visible={visible}
      onClose={onClose}
      title="산책 관리"
      height="80%"
      backgroundColor="#f8fafc"
    >
      {isAdding ? (
        <View style={styles.pickerWrapper}>
          <TimePickerCard 
            initialData={editingAlarmId ? (() => {
              const alarm = alarms.find(a => a.alarmId === editingAlarmId);
              if (alarm) {
                return {
                  hour: alarm.alarmTime.split(':')[0],
                  minute: alarm.alarmTime.split(':')[1],
                  days: alarm.alarmDays,
                  enabled: alarm.alarmStatus === AlarmStatus.YES,
                };
              }
              return undefined;
            })() : undefined}
            onSave={handleSaveAlarm} 
            onCancel={() => {
              setIsAdding(false);
              setEditingAlarmId(null);
            }} 
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setIsAdding(true)}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addButtonText}>새로운 알림 추가</Text>
          </TouchableOpacity>

          {isLoading && alarms.length === 0 ? (
            <ActivityIndicator color="#eebd2b" size="large" style={{ marginTop: 40 }} />
          ) : alarms.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>등록된 알림이 없습니다.</Text>
              <Text style={styles.emptySubText}>위의 버튼을 눌러 추가해보세요!</Text>
            </View>
          ) : (
            alarms.map(alarm => (
              <AlarmItem 
                key={alarm.alarmId}
                id={alarm.alarmId.toString()}
                hour={alarm.alarmTime.split(':')[0]}
                minute={alarm.alarmTime.split(':')[1]}
                days={alarm.alarmDays}
                enabled={alarm.alarmStatus === AlarmStatus.YES}
                onToggle={toggleAlarm}
                onDelete={deleteAlarm}
                onPress={handleEditPress}
              />
            ))
          )}
        </ScrollView>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#eebd2b" size="large" />
        </View>
      )}

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
      />
    </GlobalDetailModal>
  );
}

const styles = StyleSheet.create({
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
