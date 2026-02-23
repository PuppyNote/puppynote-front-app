import React, { useEffect } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#fcfbf8]">
      <SafeAreaView className="flex-1 px-8 pb-16 items-center justify-between">
        <View className="flex-1" />
        
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <View className="w-40 h-40 bg-[#eebd2b1a] rounded-2xl shadow-sm border-2 border-[#eebd2b33] items-center justify-center relative overflow-hidden">
            <View className="absolute inset-0 bg-[#eebd2b0d]" />
            <Text className="text-[#eebd2b] text-6xl">📖</Text>
            <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4">
              <Text className="text-[#eebd2b] text-4xl font-bold">🐾</Text>
            </View>
          </View>
          
          <View className="items-center mt-8">
            <Text className="text-slate-900 text-4xl font-bold tracking-tight mb-2">
              PuppyNote
            </Text>
            <Text className="text-[#eebd2b] font-medium tracking-wide uppercase text-xs">
              Growth & Health Tracker
            </Text>
          </View>
        </Animated.View>

        <View className="flex-1 justify-end w-full max-w-xs">
          <View className="items-center space-y-6">
            <Text className="text-slate-600 text-sm font-medium text-center leading-relaxed px-4">
              Starting your journey with your furry friend...
            </Text>
            <View className="w-full h-1.5 bg-[#eebd2b33] rounded-full overflow-hidden">
              <View className="h-full bg-[#eebd2b] rounded-full w-1/3 shadow-[0_0_8px_rgba(238,189,43,0.5)]" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
