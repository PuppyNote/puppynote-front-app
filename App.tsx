import "./global.css";
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { DeviceProvider } from './src/context/DeviceContext';

export default function App() {
  return (
    <DeviceProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </DeviceProvider>
  );
}
