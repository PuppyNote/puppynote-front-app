import React, { useState } from "react";
import { View, Switch, TouchableOpacity, StyleSheet } from "react-native";
import Card from "./Card";
import { CustomText as Text } from '../item/CustomText';
import { WheelPicker } from '../item/WheelPicker';

export const TimePickerCard = ({ 
  onSave, 
  onCancel, 
  initialData 
}: { 
  onSave?: (data: any) => void, 
  onCancel?: () => void,
  initialData?: { hour: string, minute: string, days: string[], enabled: boolean }
}) => {
  const [isEnabled, setIsEnabled] = useState(initialData?.enabled ?? true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [selectedHour, setSelectedHour] = useState(initialData?.hour ?? "09");
  
  // Round initial minute to nearest 5 for matching with 5-minute interval items
  const getInitialMinute = () => {
    if (!initialData?.minute) return "30";
    const min = parseInt(initialData.minute, 10);
    const rounded = Math.round(min / 5) * 5;
    const normalized = rounded >= 60 ? 55 : rounded;
    return String(normalized).padStart(2, "0");
  };
  
  const [selectedMinute, setSelectedMinute] = useState(getInitialMinute());
  const [selectedDays, setSelectedDays] = useState<string[]>(initialData?.days ?? []);

  const days = [
    { id: 'MON', label: '월' },
    { id: 'TUE', label: '화' },
    { id: 'WED', label: '수' },
    { id: 'THU', label: '목' },
    { id: 'FRI', label: '금' },
    { id: 'SAT', label: '토' },
    { id: 'SUN', label: '일' },
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId) 
        : [...prev, dayId]
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  
  // 5-minute intervals: 00, 05, 10, ..., 55
  const minutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );

  const handleSave = () => {
    if (onSave) {
      onSave({
        hour: selectedHour,
        minute: selectedMinute,
        days: selectedDays,
        enabled: isEnabled,
      });
    }
  };

  return (
    <Card className="p-6 bg-white rounded-4xl">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-grey-900 ml-2">
            알림 설정
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {onCancel && (
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.saveButton, { backgroundColor: '#f1f5f9' }]}
            >
              <Text style={[styles.saveButtonText, { color: '#475569' }]}>취소</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.daysContainer}>
        {days.map((day) => (
          <TouchableOpacity
            key={day.id}
            onPress={() => toggleDay(day.id)}
            style={[
              styles.dayButton,
              selectedDays.includes(day.id) && styles.selectedDayButton
            ]}
          >
            <Text style={[
              styles.dayText,
              selectedDays.includes(day.id) && styles.selectedDayText
            ]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-center items-center mb-6">
        <WheelPicker
          items={hours}
          selectedValue={selectedHour}
          onSelect={setSelectedHour}
          width={80}
        />
        <Text className="text-3xl font-bold text-grey-900 mx-4">:</Text>
        <WheelPicker
          items={minutes}
          selectedValue={selectedMinute}
          onSelect={setSelectedMinute}
          width={80}
        />
      </View>
      
      <View style={styles.highlightContainer}>
        <View style={styles.highlight} />
      </View>

      <View className="border-t border-grey-100 pt-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="ml-3">
              <Text className="text-base font-bold text-grey-800">
                알림 허용
              </Text>
              <Text className="text-sm text-grey-500">
                설정된 시간에 알림이 전송됩니다.
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#E9ECEF", true: "#FEE500" }}
            thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  timeScroller: {
    height: 150,
    width: 60,
  },
  timeScrollerItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#eebd2b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  saveButtonText: {
    color: "#0f172a",
    fontWeight: "bold",
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  selectedDayButton: {
    backgroundColor: '#eebd2b',
    borderColor: '#eebd2b',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  selectedDayText: {
    color: '#0f172a',
  },
  highlightContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 178,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  highlight: {
    backgroundColor: "#FEE50033",
    width: "80%",
    height: 50,
    borderRadius: 10,
  },
});

