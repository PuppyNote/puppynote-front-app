import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/login/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import WalkManagementScreen from '../screens/walk/WalkManagement';
import SuppliesScreen from '../screens/supply/SuppliesScreen';
import AddSupplyScreen from '../screens/supply/AddSupplyScreen';
import CategoryManagementScreen from '../screens/supply/CategoryManagementScreen';
import HealthScreen from '../screens/health/HealthScreen';
import AddWalkScreen from '../screens/walk/AddWalkScreen';
import SettingScreen from '../screens/setting/SettingScreen';
import FamilyManagementScreen from '../screens/setting/FamilyManagementScreen';
import AlertHistoryScreen from '../screens/notification/AlertHistoryScreen';
import BottomTab from '../components/common/item/BottomTab';
import TopBar from '../components/common/item/TopBar';
import { apiService } from '../services/ApiService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const navigationRef = createNavigationContainerRef();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        headerShown: true,
        header: (props) => <TopBar {...props} />,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerTitle: 'PuppyNote' }}
      />
      <Tab.Screen 
        name="Walk"
        component={WalkManagementScreen}
        options={{ headerTitle: 'PuppyNote' }}
      />
      <Tab.Screen 
        name="Supplies" 
        component={SuppliesScreen} 
        options={{ headerTitle: 'PuppyNote' }}
      />
      {/* <Tab.Screen 
        name="Health" 
        component={HealthScreen} 
        options={{ headerTitle: 'PuppyNote' }}
      /> */}
      <Tab.Screen 
        name="Settings" 
        component={SettingScreen} 
        options={{ headerTitle: 'PuppyNote' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  useEffect(() => {
    // 401 에러 시 로그인 화면으로 이동하는 리스너 등록
    apiService.setLogoutListener(() => {
      if (navigationRef.isReady()) {
        // @ts-ignore
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Walks" component={WalkManagementScreen} />
        <Stack.Screen name="AddWalk" component={AddWalkScreen} />
        <Stack.Screen name="AddSupply" component={AddSupplyScreen} />
        <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
        <Stack.Screen 
          name="FamilyManagement" 
          component={FamilyManagementScreen} 
          options={{ 
            headerShown: true,
            header: (props) => <TopBar {...props} options={{ headerTitle: '가족 관리' }} />,
          }} 
        />
        <Stack.Screen 
          name="AlertHistory" 
          component={AlertHistoryScreen} 
          options={{ 
            headerShown: true,
            header: (props) => <TopBar {...props} options={{ headerTitle: '알림 내역' }} />,
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
