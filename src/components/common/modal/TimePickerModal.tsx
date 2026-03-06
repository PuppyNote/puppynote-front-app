import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { CustomText as Text } from '../item/CustomText';
import { WheelPicker } from '../item/WheelPicker';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
  initialTime?: string; // HH:mm
  title?: string;
}

export default function TimePickerModal({
  visible,
  onClose,
  onConfirm,
  initialTime,
  title = '시간 선택',
}: TimePickerModalProps) {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
  
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');

  useEffect(() => {
    if (initialTime && initialTime.includes(':')) {
      const [h, m] = initialTime.split(':');
      if (hours.includes(h)) setSelectedHour(h);
      
      // Round to nearest 5
      const min = parseInt(m, 10);
      const rounded = Math.round(min / 5) * 5;
      const normalized = rounded >= 60 ? 55 : rounded;
      setSelectedMinute(String(normalized).padStart(2, '0'));
    }
  }, [initialTime, visible]);

  const handleConfirm = () => {
    onConfirm(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>취소</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <WheelPicker 
              items={hours} 
              selectedValue={selectedHour} 
              onSelect={setSelectedHour} 
              width={100}
            />
            <Text style={styles.separator}>:</Text>
            <WheelPicker 
              items={minutes} 
              selectedValue={selectedMinute} 
              onSelect={setSelectedMinute} 
              width={100}
            />
            
            {/* Highlight bar */}
            <View style={styles.highlightBar} pointerEvents="none" />
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
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
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeText: {
    color: '#64748b',
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginBottom: 24,
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginHorizontal: 12,
  },
  highlightBar: {
    position: 'absolute',
    height: 50,
    left: '10%',
    right: '10%',
    backgroundColor: '#eebd2b1a',
    borderRadius: 12,
    zIndex: -1,
  },
  confirmButton: {
    backgroundColor: '#eebd2b',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
