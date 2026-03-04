import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const FALLBACK_DEVICE_ID_KEY = 'fallback_device_id';

class DeviceService {
  private cachedDeviceId: string | null = null;

  /**
   * 고유 기기 ID 가져오기
   * - 캐시된 값이 있으면 즉시 반환
   * - 없으면 네이티브 ID -> 저장된 대체 ID -> 새 대체 ID 생성 순으로 진행
   */
  public async getDeviceId(): Promise<string> {
    if (this.cachedDeviceId) {
      return this.cachedDeviceId;
    }

    try {
      let id: string | null = null;
      
      // 1. 네이티브 ID 시도
      if (Platform.OS === 'android') {
        id = Application.getAndroidId();
      } else if (Platform.OS === 'ios') {
        id = await Application.getIosIdForVendorAsync();
      } else if (Platform.OS === 'web') {
        // 웹의 경우 브라우저 로컬 스토리지를 활용하거나 세션 ID 사용
        id = Constants.sessionId;
      }
      
      if (id) {
        this.cachedDeviceId = id;
        return id;
      }

      // 2. SecureStore에서 기존에 생성된 대체 ID 확인
      const savedId = await SecureStore.getItemAsync(FALLBACK_DEVICE_ID_KEY);
      if (savedId) {
        this.cachedDeviceId = savedId;
        return savedId;
      }

      // 3. 새 대체 ID 생성 및 저장
      const newId = `fallback-${Platform.OS}-${Math.random().toString(36).substring(2, 15)}`;
      await SecureStore.setItemAsync(FALLBACK_DEVICE_ID_KEY, newId);
      
      this.cachedDeviceId = newId;
      return newId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return `error-id-${Date.now()}`;
    }
  }

  // 푸시 토큰(FCM) 가져오기
  public async getFcmToken(): Promise<string> {
    if (!Device.isDevice) {
      return 'emulator-fcm-token';
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return 'permission-denied';
      }

      const tokenData = await Notifications.getDevicePushTokenAsync();
      return tokenData.data;
    } catch (error: any) {
      console.error('FCM Token Error:', error.message);
      return 'error-fcm-token';
    }
  }
}

export const deviceService = new DeviceService();
