import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Network from 'expo-network';
import Constants from 'expo-constants';
import { deviceService } from '../../services/auth/DeviceService';
import {
  AppInfoData,
  BRIDGE_ENVELOPE_VERSION,
  BRIDGE_VERSION,
  DeviceTokenData,
  NetworkStateData,
} from '../BridgeProtocol';
import { SUPPORTED_ACTIONS, SUPPORTED_EVENTS } from '../injectedBridge';
import { BridgeHandler } from './types';

/** DeviceService가 실패 시 문자열로 돌려주는 센티널 값들 */
const INVALID_PUSH_TOKENS = ['permission-denied', 'error-push-token', 'emulator-push-token'];

export const APP_VERSION: string =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '0.0.0';

export const APP_PLATFORM: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android';

/**
 * 백엔드 로그인 요청에 필요한 deviceId / pushKey를 한 번에 돌려줍니다.
 * 기존 앱의 `DeviceContext`가 하던 일을 브릿지 액션으로 옮긴 것입니다.
 */
export const getDeviceToken: BridgeHandler<void, DeviceTokenData> = async () => {
  const [deviceId, rawPushToken, permission] = await Promise.all([
    deviceService.getDeviceId(),
    deviceService.getFcmToken(),
    Notifications.getPermissionsAsync(),
  ]);

  return {
    deviceId,
    // 센티널 문자열을 그대로 백엔드에 보내지 않도록 null로 정규화합니다.
    pushToken: INVALID_PUSH_TOKENS.includes(rawPushToken) ? null : rawPushToken,
    platform: APP_PLATFORM,
    appVersion: APP_VERSION,
    permission: permission.status,
  };
};

export const getAppInfo: BridgeHandler<void, AppInfoData> = async () => ({
  bridgeVersion: BRIDGE_VERSION,
  envelopeVersion: BRIDGE_ENVELOPE_VERSION,
  platform: APP_PLATFORM,
  appVersion: APP_VERSION,
  supportedActions: SUPPORTED_ACTIONS,
  supportedEvents: SUPPORTED_EVENTS,
});

export const getNetworkState: BridgeHandler<void, NetworkStateData> = async () => {
  const state = await Network.getNetworkStateAsync();
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable ?? null,
    type: state.type ?? 'UNKNOWN',
  };
};
