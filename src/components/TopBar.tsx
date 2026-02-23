import React from 'react';
import { View, Text } from 'react-native';

export default function TopBar({ options, route }: any) {
  // 내비게이션 옵션에서 title과 icon을 가져옵니다.
  const title = options?.headerTitle || route?.name || 'PuppyNote';
  const icon = options?.headerIcon || '🐾';

  return (
    <View className="bg-white px-6 pt-12 pb-2 shadow-sm border-b border-slate-100">
      <View className="flex-row items-center py-2">
        <View className="flex-row items-center space-x-3">
          <View className="p-2 rounded-full bg-[#fcfaf2] shadow-sm border border-[#eebd2b1a]">
            <Text className="text-[#eebd2b]">{icon}</Text>
          </View>
          <Text className="text-2xl font-bold tracking-tight text-slate-900">{title}</Text>
        </View>
      </View>
    </View>
  );
}
