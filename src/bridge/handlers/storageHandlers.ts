import * as SecureStore from 'expo-secure-store';
import { bridgeError } from '../BridgeException';
import {
  ClearTokenPayload,
  GetTokenData,
  GetTokenPayload,
  SECURE_STORE_KEYS,
  SecureStoreKey,
  SetTokenPayload,
} from '../BridgeProtocol';
import { BridgeHandler } from './types';

/**
 * 웹이 임의의 키로 SecureStore를 쓰지 못하도록 화이트리스트로 막습니다.
 * 키 목록은 기존 `StorageService`가 쓰던 것과 동일합니다.
 */
function assertKey(key: unknown): SecureStoreKey {
  if (typeof key !== 'string' || !SECURE_STORE_KEYS.includes(key as SecureStoreKey)) {
    throw bridgeError.invalidPayload(
      `허용되지 않은 키입니다. 사용 가능: ${SECURE_STORE_KEYS.join(', ')}`,
    );
  }
  return key as SecureStoreKey;
}

export const setToken: BridgeHandler<SetTokenPayload, { key: SecureStoreKey }> = async (
  payload,
) => {
  const key = assertKey(payload?.key);
  if (typeof payload?.value !== 'string') {
    throw bridgeError.invalidPayload('value는 문자열이어야 합니다.');
  }
  await SecureStore.setItemAsync(key, payload.value);
  return { key };
};

export const getToken: BridgeHandler<GetTokenPayload, GetTokenData> = async (payload) => {
  const key = assertKey(payload?.key);
  const value = await SecureStore.getItemAsync(key);
  return { key, value };
};

export const clearToken: BridgeHandler<
  ClearTokenPayload | null,
  { cleared: SecureStoreKey[] }
> = async (payload) => {
  // keys를 생략하면 로그아웃으로 보고 화이트리스트 전체를 지웁니다.
  const keys: SecureStoreKey[] = payload?.keys?.length
    ? payload.keys.map(assertKey)
    : [...SECURE_STORE_KEYS];

  await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
  return { cleared: keys };
};
