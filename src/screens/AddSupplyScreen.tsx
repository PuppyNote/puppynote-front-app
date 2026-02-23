import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddSupplyScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#fcfaf2]">
      <SafeAreaView className="flex-1">
        <View className="px-6 pt-4 pb-4 flex-row items-center justify-between border-b border-slate-100 bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-slate-500 font-medium text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold tracking-tight text-slate-900">Add New Supply</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-[#eebd2b] font-bold text-lg">Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <View className="items-center justify-center py-8">
            <TouchableOpacity className="w-28 h-28 bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200 items-center justify-center">
              <Text className="text-3xl mb-1">📸</Text>
              <Text className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Add Photo</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-6">
            <View className="space-y-2">
              <Text className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Item Name</Text>
              <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <TextInput className="text-base" placeholder="e.g. Organic Puppy Food" placeholderTextColor="#cbd5e1" />
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Purchase Link</Text>
              <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row items-center space-x-3">
                <Text className="text-slate-400">🔗</Text>
                <TextInput className="flex-1 text-base" placeholder="https://..." placeholderTextColor="#cbd5e1" />
              </View>
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1 space-y-2">
                <Text className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Reminder</Text>
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row items-center space-x-2">
                  <TextInput className="flex-1 text-base" placeholder="30" placeholderTextColor="#cbd5e1" keyboardType="numeric" />
                  <Text className="text-slate-400 text-sm">days</Text>
                </View>
              </View>
              <View className="flex-1 space-y-2">
                <Text className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Category</Text>
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row items-center justify-between">
                  <Text className="text-base text-slate-900">Food</Text>
                  <Text className="text-slate-400">▼</Text>
                </View>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Notes</Text>
              <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <TextInput 
                  className="text-base min-h-[100px]" 
                  placeholder="Add any details about the item..." 
                  placeholderTextColor="#cbd5e1"
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            className="w-full py-4 bg-[#eebd2b] rounded-full shadow-lg items-center justify-center mt-8 mb-16"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-slate-900 font-bold">Save Item</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
