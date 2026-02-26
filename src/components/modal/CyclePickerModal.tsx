import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { CustomText as Text } from '../CustomText';
import { WheelPicker } from '../picker/WheelPicker';

interface CyclePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (days: number) => void;
  initialDays?: number;
}

export default function CyclePickerModal({
  visible,
  onClose,
  onConfirm,
  initialDays = 30,
}: CyclePickerModalProps) {
  const items = Array.from({ length: 365 }, (_, i) => String(i + 1));
  const [selectedValue, setSelectedValue] = useState(String(initialDays));

  useEffect(() => {
    if (visible) {
      setSelectedValue(String(initialDays));
    }
  }, [visible, initialDays]);

  const handleConfirm = () => {
    onConfirm(parseInt(selectedValue, 10));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>구매 주기 설정</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>취소</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <WheelPicker 
              items={items} 
              selectedValue={selectedValue} 
              onSelect={setSelectedValue} 
              width={100}
            />
            <Text style={styles.unit}>일 마다</Text>
            
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
  unit: {
    fontSize: 18,
    color: '#475569',
    marginLeft: 12,
    fontWeight: '500',
  },
  highlightBar: {
    position: 'absolute',
    height: 50,
    left: 0,
    right: 0,
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
