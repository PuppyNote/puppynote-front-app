import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-[#fcfaf2] px-8 items-center justify-center">
      <View className="flex flex-col items-center mb-16">
        <View className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 items-center justify-center mb-6">
          <Text className="text-[#eebd2b] text-5xl">📖</Text>
        </View>
        <Text className="text-3xl font-bold tracking-tight text-slate-900">PuppyNote</Text>
        <Text className="text-slate-500 mt-2 font-medium">Daily care for your best friend</Text>
      </View>

      <View className="w-full max-w-sm space-y-4">
        <View className="space-y-3">
          <TextInput 
            className="w-full px-5 py-4 bg-white rounded-2xl shadow-sm text-sm"
            placeholder="Email Address"
            placeholderTextColor="#94a3b8"
          />
          <TextInput 
            className="w-full px-5 py-4 bg-white rounded-2xl shadow-sm text-sm"
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity 
          className="w-full py-4 bg-[#eebd2b] rounded-full shadow-lg items-center justify-center mt-2"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-slate-900 font-bold">Login</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center space-x-4 py-4">
          <View className="h-[1px] flex-1 bg-slate-200" />
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">or continue with</Text>
          <View className="h-[1px] flex-1 bg-slate-200" />
        </View>

        <View className="space-y-3">
          <TouchableOpacity className="w-full py-4 bg-[#FEE500] rounded-full items-center justify-center flex-row space-x-3">
            <Text className="text-slate-900 font-bold">💬 Continue with Kakao</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-full py-4 bg-white rounded-full border border-slate-100 shadow-sm items-center justify-center flex-row space-x-3">
            <Text className="text-slate-900 font-bold">G Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-12 flex-row space-x-1">
        <Text className="text-sm text-slate-500 font-medium">Don't have an account?</Text>
        <TouchableOpacity>
          <Text className="text-[#eebd2b] font-bold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
