/**
 * PuppyNote JS Bridge - 프로토콜 정의
 *
 * 모바일 웹(puppynote-front-web) <-> 네이티브 앱(puppynote-front-app) 간 통신 규약.
 * 상세 규약 문서: docs/webview-migration/02-js-bridge-protocol.md
 *
 * 이 파일의 상수/타입을 바꾸면 반드시 위 문서와 웹 쪽 구현도 함께 갱신해야 합니다.
 */

/** 메시지 봉투(envelope) 스키마 버전. 하위 호환이 깨지는 변경 시에만 올립니다. */
export const BRIDGE_ENVELOPE_VERSION = 1;

/** 브릿지 구현 버전 (semver). 액션 추가 등 하위 호환 변경 시 minor를 올립니다. */
export const BRIDGE_VERSION = '1.0.0';

/** 웹이 `window.PuppyNoteBridge`로 접근하는 전역 객체 이름 */
export const BRIDGE_GLOBAL_NAME = 'PuppyNoteBridge';

/** UserAgent에 덧붙이는 앱 식별자 접두사 (`PuppyNoteApp/1.0.2`) */
export const BRIDGE_UA_TAG = 'PuppyNoteApp';

/** 요청에 응답이 오지 않을 때 웹이 reject 하는 기본 시간 (ms) */
export const BRIDGE_DEFAULT_TIMEOUT = 15000;

/** 하드웨어 뒤로가기 ack 대기 시간 (ms). 넘기면 앱이 기본 동작으로 폴백합니다. */
export const HARDWARE_BACK_ACK_TIMEOUT = 400;

// ---------------------------------------------------------------------------
// 액션 / 이벤트
// ---------------------------------------------------------------------------

/** 웹 -> 앱 요청 액션 */
export const BridgeAction = {
  LOGIN_KAKAO: 'LOGIN_KAKAO',
  LOGIN_APPLE: 'LOGIN_APPLE',
  GET_DEVICE_TOKEN: 'GET_DEVICE_TOKEN',
  GET_LOCATION: 'GET_LOCATION',
  PICK_IMAGE: 'PICK_IMAGE',
  SET_TOKEN: 'SET_TOKEN',
  GET_TOKEN: 'GET_TOKEN',
  CLEAR_TOKEN: 'CLEAR_TOKEN',
  OPEN_EXTERNAL: 'OPEN_EXTERNAL',
  HAPTIC: 'HAPTIC',
  EXIT_APP: 'EXIT_APP',
  /** 앱 정보 조회 (플랫폼, 앱 버전, 지원 액션 목록) */
  GET_APP_INFO: 'GET_APP_INFO',
  /** 네트워크 상태 즉시 조회 (이벤트가 아닌 pull 방식) */
  GET_NETWORK_STATE: 'GET_NETWORK_STATE',
} as const;

export type BridgeActionType = (typeof BridgeAction)[keyof typeof BridgeAction];

/** 앱 -> 웹 이벤트 */
export const BridgeEvent = {
  /** Android 하드웨어 뒤로가기. 웹은 ack 메시지로 처리 여부를 알려야 합니다. */
  HARDWARE_BACK: 'HARDWARE_BACK',
  /** 푸시 알림 탭으로 앱이 열림. 이동해야 할 딥링크 경로를 담습니다. */
  PUSH_OPENED: 'PUSH_OPENED',
  /** 앱 포그라운드/백그라운드 전환 */
  APP_STATE: 'APP_STATE',
  /** 네트워크 연결 상태 변화 */
  NETWORK_STATE: 'NETWORK_STATE',
} as const;

export type BridgeEventType = (typeof BridgeEvent)[keyof typeof BridgeEvent];

/** 에러 코드 */
export const BridgeErrorCode = {
  /** 이 앱 버전이 모르는 액션 (웹이 폴백 UI로 전환해야 함) */
  UNSUPPORTED_ACTION: 'UNSUPPORTED_ACTION',
  /** payload 형식이 규약과 다름 */
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  /** 사용자가 권한을 거부함 */
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  /** 사용자가 취소함 (에러 토스트를 띄우면 안 되는 정상 흐름) */
  USER_CANCELLED: 'USER_CANCELLED',
  /** 현재 플랫폼에서 제공하지 않는 기능 (예: Android에서 LOGIN_APPLE) */
  NOT_AVAILABLE: 'NOT_AVAILABLE',
  /** 앱 내부에서 처리 중 예외 발생 */
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  /** 웹 쪽에서 타임아웃으로 스스로 만든 코드 (앱이 보내지 않음) */
  TIMEOUT: 'TIMEOUT',
} as const;

export type BridgeErrorCodeType = (typeof BridgeErrorCode)[keyof typeof BridgeErrorCode];

// ---------------------------------------------------------------------------
// 메시지 봉투
// ---------------------------------------------------------------------------

/** 웹 -> 앱 요청 */
export interface BridgeRequestMessage<P = unknown> {
  v: number;
  type: 'request';
  /** 요청/응답 매칭용 uuid */
  id: string;
  action: string;
  payload?: P;
}

/** 앱 -> 웹 이벤트 ack (웹 -> 앱) */
export interface BridgeAckMessage {
  v: number;
  type: 'ack';
  /** 대응하는 이벤트의 id */
  id: string;
  /** 웹이 이 이벤트를 소비했는지. false면 앱이 기본 동작을 수행합니다. */
  handled: boolean;
}

export type BridgeInboundMessage = BridgeRequestMessage | BridgeAckMessage;

/** 앱 -> 웹 응답 */
export interface BridgeResponseMessage<D = unknown> {
  v: number;
  type: 'response';
  id: string;
  action: string;
  ok: boolean;
  data?: D;
  error?: BridgeError;
}

/** 앱 -> 웹 이벤트 */
export interface BridgeEventMessage<P = unknown> {
  v: number;
  type: 'event';
  event: string;
  /** ack가 필요한 이벤트에만 존재 (현재는 HARDWARE_BACK) */
  id?: string;
  payload?: P;
}

export interface BridgeError {
  code: BridgeErrorCodeType;
  message: string;
  /** 디버깅용 원본 정보 (운영 로그 확인용, 웹 UI에 노출 금지) */
  detail?: string;
}

// ---------------------------------------------------------------------------
// 액션별 payload / data 타입
// ---------------------------------------------------------------------------

/** LOGIN_KAKAO 응답 — 웹이 이 토큰으로 `/api/v1/auth/oauth/login`을 직접 호출합니다. */
export interface LoginKakaoData {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  /** 백엔드 oauth 로그인 요청의 snsType에 그대로 넣으면 되는 값 */
  snsType: 'KAKAO';
}

/** LOGIN_APPLE 응답 */
export interface LoginAppleData {
  /** 백엔드에 넘길 토큰 (기존 앱도 identityToken을 넘기고 있음) */
  identityToken: string;
  authorizationCode: string | null;
  /** 애플은 최초 1회에만 이메일/이름을 내려줍니다. */
  email: string | null;
  fullName: string | null;
  user: string;
  snsType: 'APPLE';
}

/** GET_DEVICE_TOKEN 응답 */
export interface DeviceTokenData {
  /** 백엔드 로그인 요청의 deviceId */
  deviceId: string;
  /** 백엔드 로그인 요청의 pushKey (Expo Push Token) */
  pushToken: string | null;
  platform: 'ios' | 'android';
  appVersion: string;
  /** 알림 권한 상태 */
  permission: 'granted' | 'denied' | 'undetermined';
}

export interface GetLocationPayload {
  accuracy?: 'low' | 'balanced' | 'high';
  /** true면 주소 문자열까지 함께 반환 (느립니다) */
  reverseGeocode?: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
  /** reverseGeocode: true 일 때만 존재 */
  address?: string | null;
}

export interface PickImagePayload {
  /** 다중 선택 여부. 기본 false */
  multiple?: boolean;
  /** multiple일 때 최대 장수. 기본 10 */
  max?: number;
  /** 단일 선택 시 크롭 UI 사용 여부. 기본 true */
  allowsEditing?: boolean;
  /** 크롭 비율 [w, h]. 기본 [1, 1] */
  aspect?: [number, number];
  /** 0~1 압축 품질. 기본 0.8 */
  quality?: number;
  /**
   * 웹이 이미지를 어떤 형태로 받을지.
   * - 'base64' (기본): data URL. 웹에서 바로 fetch->Blob->FormData 업로드 가능
   * - 'uri': file:// 경로. 웹의 fetch로는 읽을 수 없으니 미리보기 용도로만 사용
   */
  returnAs?: 'base64' | 'uri';
}

export interface PickedImage {
  /** returnAs: 'uri' 일 때의 file:// 경로 */
  uri: string;
  /** returnAs: 'base64' 일 때의 `data:image/jpeg;base64,...` */
  dataUrl?: string;
  width: number;
  height: number;
  fileName: string;
  mimeType: string;
  fileSize: number | null;
}

export interface PickImageData {
  images: PickedImage[];
}

/** SecureStore에 쓸 수 있는 키 화이트리스트. 임의 키는 INVALID_PAYLOAD로 거부합니다. */
export const SECURE_STORE_KEYS = [
  'accessToken',
  'refreshToken',
  'selectedPetId',
  'selectedPetName',
] as const;

export type SecureStoreKey = (typeof SECURE_STORE_KEYS)[number];

export interface SetTokenPayload {
  key: SecureStoreKey;
  value: string;
}

export interface GetTokenPayload {
  key: SecureStoreKey;
}

export interface GetTokenData {
  key: SecureStoreKey;
  value: string | null;
}

export interface ClearTokenPayload {
  /** 생략하면 화이트리스트 전체 삭제 (로그아웃) */
  keys?: SecureStoreKey[];
}

export interface OpenExternalPayload {
  url: string;
}

export type HapticStyle =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export interface HapticPayload {
  style?: HapticStyle;
}

export interface AppInfoData {
  bridgeVersion: string;
  envelopeVersion: number;
  platform: 'ios' | 'android';
  appVersion: string;
  supportedActions: string[];
  supportedEvents: string[];
}

export interface NetworkStateData {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  /** 'WIFI' | 'CELLULAR' | 'NONE' | 'UNKNOWN' 등 expo-network의 NetworkStateType */
  type: string;
}

export interface AppStateEventPayload {
  state: 'active' | 'background' | 'inactive';
}

export interface PushOpenedEventPayload {
  /** 웹이 이동해야 할 경로 (예: '/walk/123'). 없으면 null */
  path: string | null;
  /** 쿼리 파라미터 형태의 부가 데이터 */
  params: Record<string, string>;
  /** 푸시 원본 data 필드 (디버깅/확장용) */
  raw: Record<string, unknown>;
}
