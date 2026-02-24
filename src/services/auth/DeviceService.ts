import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

class DeviceService {
  // 고유 기기 ID 가져오기
  public async getDeviceId(): Promise<string> {
    try {
      let id: string | null = null;
      if (Platform.OS === 'android') {
        id = Application.androidId;
      } else if (Platform.OS === 'ios') {
        id = await Application.getIosIdForVendorAsync();
      }
      
      // 기기 ID가 없을 경우를 대비한 확실한 대체값 (서버 필수값 대응)
      return id || `temp-id-${Platform.OS}-${Device.modelName || 'unknown'}`;
    } catch (error) {
      console.log('Error getting device ID:', error);
      return `error-id-${Date.now()}`;
    }
  }

  // 푸시 토큰(Push Key) 가져오기
  public async getPushKey(): Promise<string> {
    // 시뮬레이터거나 Expo Go의 제약 사항 대응
    if (!Device.isDevice) {
      return 'emulator-push-key';
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

      // projectId가 없는 경우(EAS 미설정)에 대한 예외 처리
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      if (!projectId) {
        console.log('EAS Project ID not found. Using fallback for development.');
        return 'development-push-key-no-eas';
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })).data;
      
      return token;
    } catch (error) {
      console.log('Error getting push key:', error);
      return 'error-push-key';
    }
  }
}

export const deviceService = new DeviceService();
