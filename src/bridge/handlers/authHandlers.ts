import { Platform } from 'react-native';
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import * as AppleAuthentication from 'expo-apple-authentication';
import { bridgeError } from '../BridgeException';
import { LoginAppleData, LoginKakaoData } from '../BridgeProtocol';
import { BridgeHandler } from './types';

/**
 * 카카오 SDK 로그인만 수행하고 SDK 토큰을 그대로 웹에 넘깁니다.
 * 백엔드(`/api/v1/auth/oauth/login`) 호출은 웹이 담당합니다 — 앱은 얇은 쉘로 유지합니다.
 */
export const loginKakao: BridgeHandler<void, LoginKakaoData> = async () => {
  try {
    const token = await kakaoLogin();
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      idToken: token.idToken,
      snsType: 'KAKAO',
    };
  } catch (error: any) {
    // 카카오 SDK는 사용자가 취소했을 때도 throw 합니다.
    const message = String(error?.message ?? '');
    if (message === 'Logged out' || error?.code === 'E_CANCELLED_OPERATION') {
      throw bridgeError.userCancelled('카카오 로그인을 취소했습니다.');
    }
    throw bridgeError.internal(
      '카카오 로그인에 실패했습니다.',
      JSON.stringify(error, Object.getOwnPropertyNames(error ?? {})),
    );
  }
};

export const loginApple: BridgeHandler<void, LoginAppleData> = async () => {
  if (Platform.OS !== 'ios') {
    throw bridgeError.notAvailable('애플 로그인은 iOS에서만 사용할 수 있습니다.');
  }

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    throw bridgeError.notAvailable('이 기기에서는 애플 로그인을 사용할 수 없습니다.');
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw bridgeError.internal('애플 로그인 토큰을 받지 못했습니다.');
    }

    // 애플은 최초 1회 로그인에만 이름/이메일을 내려줍니다. 웹에서 이 값을 보관해야 합니다.
    const fullName = credential.fullName
      ? [credential.fullName.familyName, credential.fullName.givenName]
          .filter(Boolean)
          .join('')
      : '';

    return {
      identityToken: credential.identityToken,
      authorizationCode: credential.authorizationCode ?? null,
      email: credential.email ?? null,
      fullName: fullName || null,
      user: credential.user,
      snsType: 'APPLE',
    };
  } catch (error: any) {
    if (error?.code === 'ERR_REQUEST_CANCELED') {
      throw bridgeError.userCancelled('애플 로그인을 취소했습니다.');
    }
    throw error;
  }
};
