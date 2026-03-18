import "./global.css";
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { DeviceProvider } from './src/context/DeviceContext';
import { PetProvider } from './src/context/PetContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DeviceProvider>
        <PetProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </PetProvider>
      </DeviceProvider>
    </GestureHandlerRootView>
  );
}
