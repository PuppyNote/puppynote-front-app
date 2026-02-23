import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HealthScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#fcfaf2]">
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <View className="bg-white px-6 pb-4 shadow-sm">
          <View className="flex-row space-x-6">
            <TouchableOpacity className="pb-3 border-b-2 border-[#eebd2b]">
              <Text className="text-sm font-bold text-slate-900">Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity className="pb-3">
              <Text className="text-sm font-medium text-slate-500">Records</Text>
            </TouchableOpacity>
            <TouchableOpacity className="pb-3">
              <Text className="text-sm font-medium text-slate-500">Clinics</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-lg">October 2023</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity><Text className="text-slate-400">◀</Text></TouchableOpacity>
                <TouchableOpacity><Text className="text-slate-400">▶</Text></TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-between mb-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <Text key={day} className="text-[10px] font-bold text-slate-400 w-8 text-center">{day}</Text>
              ))}
            </View>
            <View className="flex-row flex-wrap justify-between">
              {[...Array(14)].map((_, i) => (
                <View key={i} className="w-8 h-8 items-center justify-center mb-1">
                  <Text className={`text-sm ${i === 7 ? 'font-bold bg-[#eebd2b33] rounded-full text-[#eebd2b] p-1 w-6 h-6 text-center' : 'text-slate-900'}`}>{i + 1}</Text>
                  {i === 2 && <View className="w-1 h-1 bg-red-500 rounded-full mt-1" />}
                </View>
              ))}
            </View>
          </View>

          <HealthItem 
            title="Rabies Booster" 
            location="City Pet Clinic" 
            time="Tomorrow, 10:30 AM" 
            status="D-1" 
            statusColor="text-red-500" 
            statusBg="bg-red-50"
            icon="💉"
          />
          <HealthItem 
            title="Heartworm Pill" 
            location="Monthly Treatment" 
            time="Due in 5 days" 
            status="D-5" 
            statusColor="text-orange-500" 
            statusBg="bg-orange-50"
            icon="💊"
          />
          <HealthItem 
            title="Weight Check" 
            location="Current: 12.4 lbs" 
            time="Completed: Oct 2" 
            status="Done" 
            statusColor="text-slate-500" 
            statusBg="bg-slate-100"
            icon="⚖️"
          />
          <View className="h-32" />
        </ScrollView>

        <TouchableOpacity 
          className="absolute bottom-28 right-6 w-14 h-14 items-center justify-center bg-[#eebd2b] rounded-full shadow-xl z-50"
          onPress={() => {
            console.log('Add Health Record');
          }}
        >
          <Text className="text-white text-3xl font-light">+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function HealthItem({ title, location, time, status, statusColor, statusBg, icon }: any) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row space-x-4">
          <View className={`w-16 h-16 ${statusBg} rounded-xl items-center justify-center`}>
            <Text className="text-3xl">{icon}</Text>
          </View>
          <View>
            <Text className="font-bold text-lg text-slate-900">{title}</Text>
            <View className="flex-row items-center space-x-1">
              <Text className="text-xs text-slate-400">📍 {location}</Text>
            </View>
            <Text className="text-sm text-slate-500 mt-1">{time}</Text>
          </View>
        </View>
        <View className={`${statusBg} px-3 py-1 rounded-full`}>
          <Text className={`${statusColor} text-xs font-bold`}>{status}</Text>
        </View>
      </View>
      <TouchableOpacity className="w-full py-3 bg-[#eebd2b] rounded-full items-center justify-center">
        <Text className="text-slate-900 font-bold">{status === 'Done' ? 'View Details' : 'Set Reminder'}</Text>
      </TouchableOpacity>
    </View>
  );
}
