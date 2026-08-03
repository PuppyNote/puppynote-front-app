import { BridgeAction } from '../BridgeProtocol';
import { loginApple, loginKakao } from './authHandlers';
import { getAppInfo, getDeviceToken, getNetworkState } from './deviceHandlers';
import { getLocation } from './locationHandlers';
import { pickImage } from './mediaHandlers';
import { clearToken, getToken, setToken } from './storageHandlers';
import { exitApp, haptic, openExternal } from './systemHandlers';
import { BridgeHandlerMap } from './types';

/**
 * 액션 -> 핸들러 레지스트리.
 *
 * ⚠️ 여기에 액션을 추가하면 `BridgeProtocol.ts`의 `BridgeAction`과
 * `docs/webview-migration/02-js-bridge-protocol.md`도 함께 갱신하세요.
 * 웹에 노출되는 `supportedActions`는 `BridgeAction`에서 파생되므로,
 * 레지스트리에만 추가하고 `BridgeAction`을 빼먹으면 웹이 호출할 수 없습니다.
 */
export const bridgeHandlers: BridgeHandlerMap = {
  [BridgeAction.LOGIN_KAKAO]: loginKakao,
  [BridgeAction.LOGIN_APPLE]: loginApple,
  [BridgeAction.GET_DEVICE_TOKEN]: getDeviceToken,
  [BridgeAction.GET_LOCATION]: getLocation,
  [BridgeAction.PICK_IMAGE]: pickImage,
  [BridgeAction.SET_TOKEN]: setToken,
  [BridgeAction.GET_TOKEN]: getToken,
  [BridgeAction.CLEAR_TOKEN]: clearToken,
  [BridgeAction.OPEN_EXTERNAL]: openExternal,
  [BridgeAction.HAPTIC]: haptic,
  [BridgeAction.EXIT_APP]: exitApp,
  [BridgeAction.GET_APP_INFO]: getAppInfo,
  [BridgeAction.GET_NETWORK_STATE]: getNetworkState,
};

export * from './types';
