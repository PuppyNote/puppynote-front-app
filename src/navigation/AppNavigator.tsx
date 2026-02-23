import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import WalkManagementScreen from '../screens/WalkManagement';
import SuppliesScreen from '../screens/SuppliesScreen';
import AddSupplyScreen from '../screens/AddSupplyScreen';
import HealthScreen from '../screens/HealthScreen';

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Walks" component={WalkManagementScreen} />
        <Stack.Screen name="Supplies" component={SuppliesScreen} />
        <Stack.Screen name="AddSupply" component={AddSupplyScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
