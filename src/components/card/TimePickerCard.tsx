import React, { useState } from "react";
import { View, Switch, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Card from "./Card";
import { CustomText as Text } from '../CustomText';

const TimeScroller = ({ items, selectedValue, onSelect }) => {
  return (
    <View style={styles.timeScroller}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={50}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / 50);
          onSelect(items[index]);
        }}
        contentContainerStyle={{ paddingVertical: 50 }}
      >
        {items.map((item) => (
          <View
            key={item}
            style={styles.timeScrollerItem}
          >
            <Text
              className={`text-3xl ${
                selectedValue === item
                  ? "font-bold text-grey-900"
                  : "text-grey-300"
              }`}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const TimePickerCard = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("30");

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );

  return (
    <Card className="p-6 bg-white rounded-4xl">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-grey-900 ml-2">
            산책 시간
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Save button pressed!")}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center items-center mb-6">
        <TimeScroller
          items={hours}
          selectedValue={selectedHour}
          onSelect={setSelectedHour}
        />
        <Text className="text-3xl font-bold text-grey-900 mx-4">:</Text>
        <TimeScroller
          items={minutes}
          selectedValue={selectedMinute}
          onSelect={setSelectedMinute}
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
                산책 10분전 알림이 전송됩니다.
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
    color: "white",
    fontWeight: "bold",
  },
  highlightContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 120,
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

