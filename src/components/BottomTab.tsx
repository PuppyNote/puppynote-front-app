import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function BottomTab({ state, descriptors, navigation }: any) {
  // 탭 목록 정의 (Home, Supplies, Health, Settings)
  const tabs = [
    { name: 'Home', icon: '🏠', label: 'Home' },
    { name: 'Supplies', icon: '📦', label: 'Supplies' },
    { name: 'Health', icon: '🏥', label: 'Health' },
    { name: 'Settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200 px-6 pb-8 pt-3 flex-row justify-between items-center">
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        return (
          <TouchableOpacity 
            key={tab.name}
            className="items-center space-y-1" 
            onPress={onPress}
          >
            <Text className={`text-xl ${isFocused ? 'text-[#eebd2b]' : 'text-slate-400'}`}>{tab.icon}</Text>
            <Text className={`text-[10px] ${isFocused ? 'font-bold text-[#eebd2b]' : 'font-medium text-slate-400'}`}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

