import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#fcfaf2]">
      <SafeAreaView className="flex-1">
        <View className="bg-white px-6 pt-4 pb-0 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <View className="p-2 rounded-full bg-[#fcfaf2] shadow-sm border border-[#eebd2b1a]">
                <Text className="text-[#eebd2b]">🌱</Text>
              </View>
              <Text className="text-2xl font-bold tracking-tight text-slate-900">Home</Text>
            </View>
            <TouchableOpacity className="w-10 h-10 items-center justify-center bg-[#eebd2b] rounded-full shadow-lg">
              <Text className="text-white text-2xl">+</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row space-x-6 mt-6">
            <TouchableOpacity className="pb-3 border-b-2 border-[#eebd2b]">
              <Text className="text-sm font-bold text-slate-900">Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity className="pb-3">
              <Text className="text-sm font-medium text-slate-500">Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity className="pb-3">
              <Text className="text-sm font-medium text-slate-500">Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center space-x-2">
                <View className="p-2 bg-blue-50 rounded-lg">
                  <Text className="text-blue-500">🚶</Text>
                </View>
                <Text className="font-bold text-lg">Next Walk</Text>
              </View>
              <View className="bg-[#eebd2b1a] px-3 py-1 rounded-full">
                <Text className="text-[#eebd2b] text-xs font-bold">14:30 PM</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-4 mb-4">
              <View className="w-12 h-12 rounded-full border-4 border-[#eebd2b] overflow-hidden">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo4RaKYrDo53w-hlMwsCvFNFfxl48s5ZtDRjKRpS5uB23ANcl8Q3aUz86pA_gmntrTMwbpUzicU2okQeVF1F77u9_J76WK2AcOcB0DAdfm5NSbuH1eHguFRQfD__wXcoguqzzKVC44zrcrjYOfOYmVG4lzCYo02p_iL8OI5m-7rUF4tQzw1DmnoxmSrVZ3T0Whbua3HbvvkcEvH1AGDsJM8otqKfuSJD_62_bCtT9Jhvz5xAlE5Zg-5qLJFSo3F3GizyLMsT-lwIA' }} 
                  className="w-full h-full"
                />
              </View>
              <View>
                <Text className="text-sm font-semibold">Toby is waiting!</Text>
                <Text className="text-xs text-slate-500">30 min session planned in the park</Text>
              </View>
            </View>
            <TouchableOpacity 
              className="w-full py-3 bg-[#eebd2b] rounded-full items-center justify-center"
              onPress={() => navigation.navigate('Walks')}
            >
              <Text className="text-slate-900 font-bold">Start Activity</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold px-1 mb-4">Activity Feed</Text>
            <View className="space-y-4">
              <ActivityItem icon="🍖" title="Morning Meal" subtitle="8:00 AM • Finished all" time="2h ago" color="bg-green-50" iconColor="text-green-500" />
              <ActivityItem icon="💊" title="Vitamins" subtitle="7:30 AM • Daily supplement" time="2.5h ago" color="bg-purple-50" iconColor="text-purple-500" />
              <ActivityItem icon="😴" title="Sleep" subtitle="11:00 PM - 7:00 AM • 8 hours" time="Yesterday" color="bg-orange-50" iconColor="text-orange-500" />
            </View>
          </View>

          <View className="bg-[#f59e0b1a] border border-[#f59e0b33] rounded-2xl p-4 mb-32">
            <View className="flex-row space-x-3">
              <Text className="text-[#f59e0b]">💡</Text>
              <View className="flex-1">
                <Text className="font-bold text-sm text-[#f59e0b]">Daily Tip</Text>
                <Text className="text-xs text-slate-600 mt-1">
                  Toby has been very active today! Ensure he drinks plenty of water and has a quiet rest this evening.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200 px-6 pb-8 pt-3 flex-row justify-between items-center">
          <TabItem icon="🏠" label="Home" active />
          <TabItem icon="📖" label="Diary" />
          <TabItem icon="📦" label="Supplies" onPress={() => navigation.navigate('Supplies')} />
          <TabItem icon="🏥" label="Health" onPress={() => navigation.navigate('Health')} />
          <TabItem icon="📊" label="Stats" />
          <TabItem icon="⚙️" label="Settings" />
        </View>
      </SafeAreaView>
    </View>
  );
}

function ActivityItem({ icon, title, subtitle, time, color, iconColor }: any) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row items-center space-x-4">
      <View className={`w-12 h-12 ${color} rounded-full items-center justify-center`}>
        <Text className={iconColor}>{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-bold text-sm text-slate-900">{title}</Text>
        <Text className="text-xs text-slate-500">{subtitle}</Text>
      </View>
      <Text className="text-[10px] text-slate-400">{time}</Text>
    </View>
  );
}

function TabItem({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity className="items-center space-y-1" onPress={onPress}>
      <Text className={`text-xl ${active ? 'text-[#eebd2b]' : 'text-slate-400'}`}>{icon}</Text>
      <Text className={`text-[10px] ${active ? 'font-bold text-[#eebd2b]' : 'font-medium text-slate-400'}`}>{label}</Text>
    </TouchableOpacity>
  );
}
