import { BackHandler, Linking, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { bridgeError } from '../BridgeException';
import { HapticPayload, HapticStyle, OpenExternalPayload } from '../BridgeProtocol';
import { BridgeHandler } from './types';

/** 앱 밖으로 나갈 수 있는 스킴만 허용합니다. */
const ALLOWED_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

export const openExternal: BridgeHandler<OpenExternalPayload, { opened: boolean }> = async (
  payload,
) => {
  const url = payload?.url;
  if (typeof url !== 'string' || !url.trim()) {
    throw bridgeError.invalidPayload('url은 비어있지 않은 문자열이어야 합니다.');
  }

  const scheme = ALLOWED_SCHEMES.find((s) => url.toLowerCase().startsWith(s));
  if (!scheme) {
    throw bridgeError.invalidPayload(
      `허용되지 않은 스킴입니다. 사용 가능: ${ALLOWED_SCHEMES.join(', ')}`,
    );
  }

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw bridgeError.notAvailable('이 링크를 열 수 있는 앱이 없습니다.');
  }

  await Linking.openURL(url);
  return { opened: true };
};

const IMPACT_STYLES: Record<string, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

const NOTIFICATION_STYLES: Record<string, Haptics.NotificationFeedbackType> = {
  success: Haptics.NotificationFeedbackType.Success,
  warning: Haptics.NotificationFeedbackType.Warning,
  error: Haptics.NotificationFeedbackType.Error,
};

export const haptic: BridgeHandler<HapticPayload | null, { style: HapticStyle }> = async (
  payload,
) => {
  const style = (payload?.style ?? 'light') as HapticStyle;

  if (IMPACT_STYLES[style]) {
    await Haptics.impactAsync(IMPACT_STYLES[style]);
  } else if (NOTIFICATION_STYLES[style]) {
    await Haptics.notificationAsync(NOTIFICATION_STYLES[style]);
  } else if (style === 'selection') {
    await Haptics.selectionAsync();
  } else {
    throw bridgeError.invalidPayload(
      'style은 light/medium/heavy/success/warning/error/selection 중 하나여야 합니다.',
    );
  }

  return { style };
};

/**
 * Android에서만 앱을 종료합니다.
 * iOS는 앱이 스스로 종료하면 App Store 심사에서 거부되므로 NOT_AVAILABLE을 돌려줍니다.
 */
export const exitApp: BridgeHandler<void, { exited: boolean }> = async (_payload, context) => {
  if (Platform.OS !== 'android') {
    throw bridgeError.notAvailable('iOS에서는 앱을 강제 종료할 수 없습니다.');
  }
  // 응답이 웹에 먼저 전달되도록 다음 tick에 종료합니다.
  setTimeout(() => {
    context.exitApp();
    BackHandler.exitApp();
  }, 0);
  return { exited: true };
};
