import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuppliesScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#fcfaf2]">
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <View className="bg-white px-6 pb-4 shadow-sm">
          <View className="flex-row space-x-6">
            <TouchableOpacity className="pb-3 border-b-2 border-[#eebd2b]">
              <Text className="text-sm font-bold text-slate-900">All Items</Text>
            </TouchableOpacity>
            <TouchableOpacity className="pb-3">
              <Text className="text-sm font-medium text-slate-500">Low Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity className="pb-3">
              <Text className="text-sm font-medium text-slate-500">History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <SupplyItem 
            title="Premium Puppy Food" 
            category="Food" 
            status="In 3 days" 
            statusColor="text-red-500" 
            statusBg="bg-red-50"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDQngR7iBTWfN8h-0vz34AlWfv1h-cleScZfne4pEM_pdGvyA4T4am7CBdbyx1b9kn_6zVQE0_JQ_BbnkYhNZRNqvYe4vv342gZdkpSzOzY_VHwJTeUIkf45wwV-O9vHZayYbGUYQXrfqp1PWbFakO6REPrdCizv1iqaeyG-C5UCcpA09nuJHe-vixH7ftyjayhVJNsh3EVExmZPLGhjhU14-4371Xp3ZmpdJI3OGcGdcjI80EVXdk7Zql25uOT40Ef0BEZCAHQ8ko"
          />
          <SupplyItem 
            title="Hygienic Pads" 
            category="Hygiene" 
            status="In 12 days" 
            statusColor="text-orange-500" 
            statusBg="bg-orange-50"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDnB44Nhvj4H02Wo4ZS72w9ekAz3y6KjryST4Y535suUIXVNASEqLSrCEkrVPslIVoRciP1mbo6sHLeqqWGuWlq07pXs8UAsmFaz3E_xjr_hW8iw6ylyz0J7XgRBnML4Ui89FacStfo4pWXLnNsfkTAoikQgUraUNf4qHDI1i9PhAgtAEOn9gCS7D-q_DhrPQkiiT34JHigV4MqEAQHBXIHwRjIAqn-LZWNlp5xLH6zNWJOw4b7h1i8oGZw5cm8Rd-KAjqK8LxjHGI"
          />
          <SupplyItem 
            title="Dental Chews" 
            category="Treats" 
            status="Stock OK" 
            statusColor="text-green-500" 
            statusBg="bg-green-50"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCSw-YVsazmsAxslAoER0np_8AHYGHowWtt1e7VFcv0KfVJsfiSITuNJhBnLqgd1_T8mnrg9kjihGwPyFGhBEDtKI-JLO5y-h5_D_UPRp0ahtJLo0xYJ3BRW1raiiT1K5rGEDfLHUWrwHSd-3t8g69ng1y2QX9Ys2585re9yh91D0keMybigFR382clgRBPkvUTqvJMIv2oCnON1x7zn6krEebjlUTG4vn6oHAuZ9jUYA9k9SB8WS-AsSVyaOBekT6t_aVxSznaYSE"
          />
          <View className="h-32" />
        </ScrollView>

        <TouchableOpacity 
          className="absolute bottom-28 right-6 w-14 h-14 items-center justify-center bg-[#eebd2b] rounded-full shadow-xl z-50"
          onPress={() => navigation.navigate('AddSupply')}
        >
          <Text className="text-white text-3xl font-light">+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function SupplyItem({ title, category, status, statusColor, statusBg, image }: any) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row items-center space-x-4 mb-4">
      <Image source={{ uri: image }} className="w-16 h-16 rounded-xl" />
      <View className="flex-1">
        <Text className="font-bold text-lg text-slate-900">{title}</Text>
        <Text className="text-xs text-slate-400">{category}</Text>
      </View>
      <View className={`${statusBg} px-3 py-1 rounded-full`}>
        <Text className={`${statusColor} text-xs font-bold`}>{status}</Text>
      </View>
    </View>
  );
}
