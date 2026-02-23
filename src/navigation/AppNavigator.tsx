import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import WalkManagementScreen from '../screens/WalkManagement';
import SuppliesScreen from '../screens/SuppliesScreen';
import AddSupplyScreen from '../screens/AddSupplyScreen';
import HealthScreen from '../screens/HealthScreen';
import BottomTab from '../components/BottomTab';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Supplies" component={SuppliesScreen} />
      <Tab.Screen name="Health" component={HealthScreen} />
      <Tab.Screen name="Settings" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Walks" component={WalkManagementScreen} />
        <Stack.Screen name="AddSupply" component={AddSupplyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

