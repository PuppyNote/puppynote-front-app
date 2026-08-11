import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/login/LoginScreen';
import WebViewShellScreen from '../screens/webview/WebViewShellScreen';
import { apiService } from '../services/ApiService';
import { usePet } from '../context/PetContext';
import { WEBVIEW_MODE } from '../config/webview';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function AppNavigator() {
  const { resetPetContext } = usePet();

  useEffect(() => {
    // 401 에러 시 로그인 화면으로 이동하는 리스너 등록
    apiService.setLogoutListener(() => {
      resetPetContext(); // Context 초기화
      if (navigationRef.isReady()) {
        // @ts-ignore
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    });
  }, [resetPetContext]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        // 기본값(WEBVIEW_MODE=true)은 WebView 쉘로 바로 진입합니다.
        // 네이티브 로그인 흐름을 보려면 EXPO_PUBLIC_WEBVIEW_MODE=false로 Splash부터 시작하세요.
        initialRouteName={WEBVIEW_MODE ? 'WebViewShell' : 'Splash'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="WebViewShell" component={WebViewShellScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
