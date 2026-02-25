import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { CustomText as Text } from '../CustomText';
import { WheelPicker } from '../picker/WheelPicker';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  initialDate?: string; // YYYY-MM-DD
}

export default function DatePickerModal({
  visible,
  onClose,
  onConfirm,
  initialDate,
}: DatePickerModalProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => String(currentYear - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedDay, setSelectedDay] = useState('01');

  useEffect(() => {
    if (initialDate && initialDate.includes('-')) {
      const [y, m, d] = initialDate.split('-');
      if (years.includes(y)) setSelectedYear(y);
      if (months.includes(m)) setSelectedMonth(m);
      setSelectedDay(d);
    }
  }, [initialDate, visible]);

  // Get days in selected month/year
  const getDaysInMonth = (year: string, month: string) => {
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const daysCount = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysCount }, (_, i) => String(i + 1).padStart(2, '0'));

  // Ensure selected day is valid when month/year changes
  useEffect(() => {
    if (parseInt(selectedDay) > daysCount) {
      setSelectedDay(String(daysCount).padStart(2, '0'));
    }
  }, [selectedYear, selectedMonth]);

  const handleConfirm = () => {
    onConfirm(`${selectedYear}-${selectedMonth}-${selectedDay}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>날짜 선택</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>취소</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <WheelPicker 
              items={years} 
              selectedValue={selectedYear} 
              onSelect={setSelectedYear} 
              width={100}
            />
            <Text style={styles.separator}>년</Text>
            <WheelPicker 
              items={months} 
              selectedValue={selectedMonth} 
              onSelect={setSelectedMonth} 
              width={60}
            />
            <Text style={styles.separator}>월</Text>
            <WheelPicker 
              items={days} 
              selectedValue={selectedDay} 
              onSelect={setSelectedDay} 
              width={60}
            />
            <Text style={styles.separator}>일</Text>
            
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
    fontSize: 16,
    color: '#475569',
    marginHorizontal: 4,
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
