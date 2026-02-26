import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import BottomTab from '../components/tabs/BottomTab';
import TopBar from '../components/tabs/TopBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      <Tab.Screen 
        name="Health" 
        component={HealthScreen} 
        options={{ headerTitle: 'PuppyNote' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={HomeScreen} 
        options={{ headerTitle: 'PuppyNote' }}
      />
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
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Walks" component={WalkManagementScreen} />
        <Stack.Screen name="AddWalk" component={AddWalkScreen} />
        <Stack.Screen name="AddSupply" component={AddSupplyScreen} />
        <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

