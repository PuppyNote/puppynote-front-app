# PuppyNote JS Bridge 규약 v1.0.0 (초안)

> **대상 독자**: `puppynote-front-web` 모바일 웹 개발자
> **네이티브 구현**: `src/bridge/` (puppynote-front-app)
> **봉투 스키마 버전**: `1` / **브릿지 구현 버전**: `1.0.0`
> **상태**: Phase 0 초안. 웹 쪽 요구사항에 따라 액션 추가/변경 가능하니 `ask_employee`로 알려주세요.

앱은 화면을 그리지 않는 **얇은 쉘**입니다. 화면은 전부 모바일 웹이 그리고,
웹이 브라우저에서 할 수 없는 것(네이티브 SDK 로그인, 푸시 토큰, SecureStore, 카메라롤, 위치,
햅틱, 앱 종료)만 이 브릿지를 통해 앱에 위임합니다.

---

## 1. 앱 내부인지 판별하기

```js
export const isInApp = () => typeof window !== 'undefined' && !!window.PuppyNoteBridge;
```

`window.PuppyNoteBridge`는 **웹 페이지의 어떤 스크립트보다 먼저** 주입됩니다
(`injectedJavaScriptBeforeContentLoaded`). 따라서 첫 렌더 시점부터 안전하게 검사할 수 있습니다.

혹시 모를 레이스를 위해 준비 완료 이벤트도 쏩니다:

```js
if (!window.PuppyNoteBridge) {
  window.addEventListener('puppynotebridgeready', onReady, { once: true });
}
```

**보조 판별 수단** — UserAgent에 `PuppyNoteApp/<앱버전>`이 붙습니다.
서버 사이드 렌더링에서 앱/브라우저를 나눠야 할 때 쓰세요.

```
Mozilla/5.0 (...) ... PuppyNoteApp/1.0.2
```

> ⚠️ **일반 브라우저에서도 웹이 동작해야 합니다.** 브릿지가 없으면 웹 표준 API로 폴백하세요
> (예: `PICK_IMAGE` → `<input type="file">`, `GET_LOCATION` → `navigator.geolocation`,
> `SET_TOKEN` → `localStorage`).

---

## 2. 전역 객체 API

```ts
interface PuppyNoteBridge {
  /** 브릿지 구현 버전 (semver). 예: '1.0.0' */
  version: string;
  /** 메시지 봉투 스키마 버전. 예: 1 */
  envelopeVersion: number;
  platform: 'ios' | 'android';
  /** 앱 버전. 예: '1.0.2' */
  appVersion: string;
  /** 이 앱 버전이 처리할 수 있는 액션 이름 목록 */
  supportedActions: string[];
  /** 이 앱 버전이 발행하는 이벤트 이름 목록 */
  supportedEvents: string[];

  isSupported(action: string): boolean;

  /** 웹 -> 앱 요청. uuid로 응답을 매칭하는 Promise를 돌려줍니다. */
  request<T = unknown>(
    action: string,
    payload?: unknown,
    options?: { timeout?: number },   // 기본 15000ms, 0이면 무한 대기
  ): Promise<T>;

  /**
   * 앱 -> 웹 이벤트 구독. 해제 함수를 돌려줍니다.
   * 핸들러가 `true`를 반환하면 "웹이 이 이벤트를 소비했다"는 뜻입니다 (HARDWARE_BACK에서 중요).
   */
  on(event: string, handler: (payload: any) => boolean | void): () => void;
  off(event: string, handler: Function): void;
}
```

### 에러 객체

`request()`의 reject 값은 `code` 프로퍼티를 가진 `Error`입니다.

```js
try {
  await window.PuppyNoteBridge.request('GET_LOCATION');
} catch (e) {
  if (e.code === 'USER_CANCELLED') return;          // 토스트 띄우지 말 것
  if (e.code === 'PERMISSION_DENIED') showSettingsGuide();
  else showToast(e.message);
}
```

| code | 의미 | 웹 권장 처리 |
|---|---|---|
| `UNSUPPORTED_ACTION` | 이 앱 버전이 모르는 액션 (구버전 앱) | 웹 표준 API로 폴백하거나 "앱 업데이트" 안내 |
| `INVALID_PAYLOAD` | payload 형식 오류 | 개발 버그. 로그 남기기 |
| `PERMISSION_DENIED` | 사용자가 OS 권한 거부 | 설정 이동 안내 |
| `USER_CANCELLED` | 사용자가 취소 (정상 흐름) | **아무 것도 하지 않기** |
| `NOT_AVAILABLE` | 이 플랫폼/기기에서 불가 (예: Android의 애플 로그인) | 해당 UI 숨기기 |
| `INTERNAL_ERROR` | 앱 내부 예외 | 일반 오류 토스트 |
| `TIMEOUT` | 시간 내 응답 없음 (웹이 스스로 만든 코드) | 재시도 안내 |

---

## 3. 메시지 봉투

전송 채널은 두 개입니다.
- 웹 → 앱: `window.ReactNativeWebView.postMessage(JSON.stringify(msg))` (브릿지가 감싸므로 직접 쓸 일 없음)
- 앱 → 웹: 앱이 `window.PuppyNoteBridge.__receive(json)`을 호출 (직접 쓰지 마세요)

### 웹 → 앱: 요청

```json
{
  "v": 1,
  "type": "request",
  "id": "9c8f...-uuid-v4",
  "action": "GET_LOCATION",
  "payload": { "accuracy": "balanced" }
}
```

### 앱 → 웹: 응답 (성공)

```json
{
  "v": 1,
  "type": "response",
  "id": "9c8f...-uuid-v4",
  "action": "GET_LOCATION",
  "ok": true,
  "data": { "latitude": 37.5, "longitude": 127.0, "accuracy": 12.3, "timestamp": 1754200000000 }
}
```

### 앱 → 웹: 응답 (실패)

```json
{
  "v": 1,
  "type": "response",
  "id": "9c8f...-uuid-v4",
  "action": "GET_LOCATION",
  "ok": false,
  "error": { "code": "PERMISSION_DENIED", "message": "위치 권한이 거부되었습니다." }
}
```

### 앱 → 웹: 이벤트

```json
{ "v": 1, "type": "event", "event": "APP_STATE", "payload": { "state": "active" } }
```

### 웹 → 앱: ack (응답이 필요한 이벤트에만)

`id`가 붙은 이벤트(현재는 `HARDWARE_BACK`)는 웹이 반드시 ack를 돌려줘야 합니다.
브릿지가 `on()` 핸들러의 반환값을 보고 자동으로 보내므로 웹이 직접 만들 일은 없습니다.

```json
{ "v": 1, "type": "ack", "id": "evt-3-1754200000000", "handled": true }
```

### 버전 협상

- `v`(봉투 버전)가 올라가는 것은 **하위 호환이 깨질 때뿐**입니다. 지금은 항상 `1`.
- 액션 추가처럼 하위 호환되는 변경은 `PuppyNoteBridge.version`의 minor만 올립니다.
- 웹은 액션을 부르기 전에 `isSupported()`로 확인하세요. 앱은 스토어 심사 때문에 항상 늦게 배포됩니다.

```js
const bridge = window.PuppyNoteBridge;
if (bridge?.isSupported('HAPTIC')) {
  bridge.request('HAPTIC', { style: 'light' }).catch(() => {});  // 실패해도 무시
}
```

---

## 4. 웹 → 앱 요청 액션

### 4-1. `LOGIN_KAKAO`

카카오 네이티브 SDK 로그인을 띄우고 **SDK 토큰만** 돌려줍니다.
백엔드 `/api/v1/auth/oauth/login` 호출은 **웹이 직접** 합니다 (앱을 얇게 유지).

| | |
|---|---|
| payload | 없음 |
| 권장 timeout | `60000` (사용자가 카카오톡 앱을 오가므로 길게) |

```ts
// data
{
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  snsType: 'KAKAO';
}
```

```js
const { accessToken } = await bridge.request('LOGIN_KAKAO', null, { timeout: 60000 });
const { deviceId, pushToken } = await bridge.request('GET_DEVICE_TOKEN');
await api.post('/api/v1/auth/oauth/login', {
  token: accessToken, snsType: 'KAKAO', deviceId, pushKey: pushToken,
});
```

에러: `USER_CANCELLED`(취소), `INTERNAL_ERROR`(키해시 불일치 등 — `detail`에 원본 담김)

### 4-2. `LOGIN_APPLE`

**iOS 전용.** Android에서 부르면 `NOT_AVAILABLE`. 웹은 `bridge.platform === 'ios'`일 때만 버튼을 노출하세요.

| | |
|---|---|
| payload | 없음 |
| 권장 timeout | `60000` |

```ts
// data
{
  identityToken: string;        // 백엔드에 넘길 토큰
  authorizationCode: string | null;
  email: string | null;         // ⚠️ 최초 1회 로그인에만 값이 옵니다
  fullName: string | null;      // ⚠️ 최초 1회 로그인에만 값이 옵니다
  user: string;                 // 애플 고유 사용자 ID
  snsType: 'APPLE';
}
```

> ⚠️ 애플은 두 번째 로그인부터 `email`/`fullName`을 `null`로 내려줍니다.
> 최초 로그인 응답을 받은 즉시 백엔드에 전달해야 합니다.

에러: `USER_CANCELLED`, `NOT_AVAILABLE`(Android/미지원 기기), `INTERNAL_ERROR`

### 4-3. `GET_DEVICE_TOKEN`

백엔드 로그인 요청에 필요한 `deviceId` / `pushKey`를 한 번에 가져옵니다.
푸시 권한이 없으면 이 액션이 권한 요청 다이얼로그를 띄웁니다.

| | |
|---|---|
| payload | 없음 |
| 권장 timeout | 기본값 |

```ts
// data
{
  deviceId: string;                                  // 백엔드 로그인의 deviceId
  pushToken: string | null;                          // 백엔드 로그인의 pushKey. 권한 거부/에뮬레이터면 null
  platform: 'ios' | 'android';
  appVersion: string;
  permission: 'granted' | 'denied' | 'undetermined';
}
```

> `pushToken`은 Expo Push Token(`ExponentPushToken[...]`) 형식입니다.
> 권한 거부·에뮬레이터·발급 실패는 전부 `null`로 정규화되니 그대로 백엔드에 보내면 됩니다.

### 4-4. `GET_LOCATION`

```ts
// payload (전부 optional)
{
  accuracy?: 'low' | 'balanced' | 'high';  // 기본 'balanced'
  reverseGeocode?: boolean;                // 기본 false. true면 주소 문자열도 같이 (느림)
}

// data
{
  latitude: number;
  longitude: number;
  accuracy: number | null;   // 미터
  timestamp: number;         // epoch ms
  address?: string | null;   // reverseGeocode: true 일 때만. 실패해도 전체 실패시키지 않고 null
}
```

권장 timeout: `high`는 `30000`, 그 외 기본값.
에러: `PERMISSION_DENIED`, `INVALID_PAYLOAD`, `INTERNAL_ERROR`

### 4-5. `PICK_IMAGE`

```ts
// payload (전부 optional)
{
  multiple?: boolean;              // 기본 false
  max?: number;                    // multiple일 때 최대 장수. 기본 10, 상한 20
  allowsEditing?: boolean;         // 단일 선택 시 크롭 UI. 기본 true
  aspect?: [number, number];       // 크롭 비율. 기본 [1, 1]
  quality?: number;                // 0~1. 기본 0.8
  returnAs?: 'base64' | 'uri';     // 기본 'base64'
}

// data
{
  images: Array<{
    uri: string;              // file:// 경로 (returnAs와 무관하게 항상 옴)
    dataUrl?: string;         // returnAs: 'base64'일 때 'data:image/jpeg;base64,...'
    width: number;
    height: number;
    fileName: string;
    mimeType: string;
    fileSize: number | null;
  }>;
}
```

> ⚠️ **`uri`는 웹의 `fetch`로 읽을 수 없습니다.** `<img src>` 미리보기에는 쓸 수 있지만
> 업로드에는 못 씁니다. 업로드하려면 `returnAs: 'base64'`(기본값)로 받아 `dataUrl`을 쓰세요.

```js
const { images } = await bridge.request('PICK_IMAGE', { multiple: true, max: 5 }, { timeout: 120000 });
const blob = await (await fetch(images[0].dataUrl)).blob();
const form = new FormData();
form.append('file', blob, images[0].fileName);
await api.post('/api/v1/storage/POST', form);
```

권장 timeout: `120000` (사용자가 사진첩에서 고르는 시간)
에러: `USER_CANCELLED`, `PERMISSION_DENIED`, `INVALID_PAYLOAD`(장당 base64 6MB 초과 시)

### 4-6. `SET_TOKEN` / `GET_TOKEN` / `CLEAR_TOKEN` (SecureStore)

OS의 보안 저장소(iOS Keychain / Android Keystore)를 씁니다.
**웹뷰의 `localStorage`와 달리 앱을 지우기 전까지 유지되고, 다른 앱이 읽을 수 없습니다.**

허용 키 (화이트리스트 — 그 외는 `INVALID_PAYLOAD`):

```
accessToken | refreshToken | selectedPetId | selectedPetName
```

```ts
// SET_TOKEN
payload: { key: SecureStoreKey; value: string }
data:    { key: SecureStoreKey }

// GET_TOKEN
payload: { key: SecureStoreKey }
data:    { key: SecureStoreKey; value: string | null }   // 없으면 value: null

// CLEAR_TOKEN
payload: { keys?: SecureStoreKey[] }   // 생략하면 화이트리스트 전체 삭제 (= 로그아웃)
data:    { cleared: SecureStoreKey[] }
```

> 키를 추가하려면 앱 배포가 필요합니다(`src/bridge/BridgeProtocol.ts`의 `SECURE_STORE_KEYS`).
> 필요한 키가 생기면 `ask_employee`로 알려주세요.

**웹 폴백**: 브라우저에서는 `localStorage`로 같은 인터페이스를 감싸 쓰시길 권합니다.

```js
const storage = {
  async set(key, value) {
    return isInApp() ? bridge.request('SET_TOKEN', { key, value })
                     : localStorage.setItem(key, value);
  },
  async get(key) {
    if (!isInApp()) return localStorage.getItem(key);
    const { value } = await bridge.request('GET_TOKEN', { key });
    return value;
  },
  async clear() {
    return isInApp() ? bridge.request('CLEAR_TOKEN') : localStorage.clear();
  },
};
```

### 4-7. `OPEN_EXTERNAL`

WebView 밖(기본 브라우저 / 메일 / 전화 앱)에서 링크를 엽니다.

```ts
payload: { url: string }   // http:, https:, mailto:, tel: 만 허용
data:    { opened: true }
```

에러: `INVALID_PAYLOAD`(허용되지 않은 스킴), `NOT_AVAILABLE`(열 수 있는 앱 없음)

> 참고: 웹 오리진 밖의 `<a href>` 링크는 앱 쉘이 **자동으로** 외부 브라우저로 넘깁니다.
> 이 액션은 JS에서 명시적으로 열어야 할 때만 쓰세요.

### 4-8. `HAPTIC`

```ts
payload: { style?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection' }
data:    { style: string }
```

기본 `'light'`. 실패해도 UX에 영향 없으니 `.catch(() => {})`로 삼키세요.

### 4-9. `EXIT_APP`

**Android 전용.** iOS는 앱이 스스로 종료하면 App Store 심사에서 거부되므로 `NOT_AVAILABLE`을 돌려줍니다.

```ts
payload: 없음
data:    { exited: true }
```

주 용도: 홈 화면에서 뒤로가기를 두 번 눌러 종료하는 패턴.

### 4-10. `GET_APP_INFO`

```ts
// data
{
  bridgeVersion: string;      // '1.0.0'
  envelopeVersion: number;    // 1
  platform: 'ios' | 'android';
  appVersion: string;         // '1.0.2'
  supportedActions: string[];
  supportedEvents: string[];
}
```

`window.PuppyNoteBridge`의 동명 프로퍼티와 같은 값이라 보통 필요 없지만,
로그/에러 리포팅에 앱 정보를 실을 때 쓰세요.

### 4-11. `GET_NETWORK_STATE`

이벤트를 기다리지 않고 현재 네트워크 상태를 즉시 조회합니다.

```ts
// data
{
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;   // 'WIFI' | 'CELLULAR' | 'NONE' | 'UNKNOWN' ...
}
```

---

## 5. 앱 → 웹 이벤트

```js
const off = window.PuppyNoteBridge.on('APP_STATE', ({ state }) => {
  if (state === 'active') refetchAll();
});
// 정리
off();
```

### 5-1. `HARDWARE_BACK` (Android 전용, **ack 필수**)

Android 하드웨어/제스처 뒤로가기입니다.
앱은 WebView의 기본 `goBack()`을 **하지 않고** 이 이벤트만 웹으로 보냅니다.
판단은 전적으로 웹이 합니다.

```js
bridge.on('HARDWARE_BACK', () => {
  if (isModalOpen) { closeModal(); return true; }   // true = 웹이 처리함
  if (router.canGoBack())  { router.back(); return true; }
  return false;                                     // false = 앱에 기본 동작 위임
});
```

**핸들러 반환값이 중요합니다.**

| 반환값 | 앱 동작 |
|---|---|
| `true` | 아무것도 하지 않음 (웹이 처리했다고 간주) |
| `false` / `undefined` | WebView 히스토리가 있으면 `goBack()`, 없으면 **앱 종료** |
| 구독자 없음 | 즉시 `handled: false`로 ack → 위와 동일한 폴백 |
| **400ms 내 ack 없음** | `handled: false`로 간주 → 위와 동일한 폴백 |

> ⚠️ 핸들러 안에서 `await`을 하면 400ms 안에 ack가 못 나갑니다.
> **동기적으로 판단하고 즉시 반환**한 뒤, 무거운 작업은 그 후에 하세요.

여러 핸들러를 등록하면 **하나라도 `true`를 반환하면 처리된 것**으로 봅니다.
모달/시트마다 등록해도 안전합니다.

payload: `{}` (없음)

### 5-2. `PUSH_OPENED`

사용자가 푸시 알림을 탭해서 앱이 열렸을 때 (콜드 스타트 / 백그라운드 복귀 모두).

```ts
// payload
{
  path: string | null;              // 웹이 이동할 경로. 예: '/walk/12'
  params: Record<string, string>;   // 푸시 data의 문자열 필드 전부
  raw: Record<string, unknown>;     // 푸시 data 원본
}
```

```js
bridge.on('PUSH_OPENED', ({ path }) => {
  if (path) router.push(path);
});
```

**경로 추출 규칙**: 푸시 `data`의 `path` → `link` → `deepLink` → `url` 순으로 첫 번째 문자열을 씁니다.
`puppynote://walk/12` 같은 스킴 형태는 `/walk/12`로 정규화합니다. 없으면 `null`.

> ⚠️ **백엔드와 `data.path` 형식을 합의해야 합니다.** 현재 백엔드가 어떤 키로 내려주는지
> 미확인이라, 위 4개 키를 모두 받도록 열어뒀습니다. 확정되면 이 문서를 갱신합니다.

**콜드 스타트 레이스**: 앱이 꺼진 상태에서 푸시로 열리면 이벤트가 웹 JS보다 먼저 도착할 수 있습니다.
웹 쪽 브릿지에 **replay 버퍼**가 있어서, 나중에 `on('PUSH_OPENED')`를 등록해도 놓친 이벤트를 받습니다.
(버퍼는 이벤트당 최대 20건, `HARDWARE_BACK`처럼 ack가 필요한 이벤트는 버퍼링하지 않습니다.)

### 5-3. `APP_STATE`

```ts
// payload
{ state: 'active' | 'background' | 'inactive' }   // 'inactive'는 iOS 전용(전환 중)
```

용도: 백그라운드에서 돌아왔을 때 데이터 갱신, 토큰 만료 확인 등.

### 5-4. `NETWORK_STATE`

연결 상태가 **바뀔 때만** 옵니다. 현재 상태가 필요하면 `GET_NETWORK_STATE`를 쓰세요.

```ts
// payload
{
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;   // 'WIFI' | 'CELLULAR' | 'NONE' | 'UNKNOWN' ...
}
```

---

## 6. 웹 쪽 권장 래퍼

그대로 복사해 쓰셔도 됩니다.

```ts
// src/lib/bridge.ts (puppynote-front-web)
type Bridge = {
  version: string;
  platform: 'ios' | 'android';
  appVersion: string;
  supportedActions: string[];
  isSupported(a: string): boolean;
  request<T>(a: string, p?: unknown, o?: { timeout?: number }): Promise<T>;
  on(e: string, h: (p: any) => boolean | void): () => void;
};

export const getBridge = (): Bridge | null =>
  typeof window === 'undefined' ? null : ((window as any).PuppyNoteBridge ?? null);

export const isInApp = () => getBridge() !== null;

export class BridgeUnavailable extends Error {}

/** 앱이면 브릿지로, 아니면 웹 폴백으로. 폴백이 없으면 BridgeUnavailable을 던집니다. */
export async function call<T>(
  action: string,
  payload?: unknown,
  opts?: { timeout?: number; fallback?: () => Promise<T> },
): Promise<T> {
  const bridge = getBridge();
  if (bridge?.isSupported(action)) {
    try {
      return await bridge.request<T>(action, payload, { timeout: opts?.timeout });
    } catch (e: any) {
      // 구버전 앱이 모르는 액션이면 웹 폴백으로 내려갑니다.
      if (e?.code !== 'UNSUPPORTED_ACTION' || !opts?.fallback) throw e;
    }
  }
  if (opts?.fallback) return opts.fallback();
  throw new BridgeUnavailable(`${action} is not available in this environment`);
}

/** 취소는 정상 흐름이므로 조용히 삼킵니다. */
export const isCancelled = (e: any) => e?.code === 'USER_CANCELLED';
```

사용 예:

```ts
const location = await call('GET_LOCATION', { accuracy: 'balanced' }, {
  fallback: () => new Promise((res, rej) =>
    navigator.geolocation.getCurrentPosition(
      (p) => res({
        latitude: p.coords.latitude,
        longitude: p.coords.longitude,
        accuracy: p.coords.accuracy,
        timestamp: p.timestamp,
      }),
      rej,
    ),
  ),
});
```

---

## 7. 네이티브 구현 현황 (2026-08-03)

| 파일 | 내용 | 상태 |
|---|---|---|
| `src/bridge/BridgeProtocol.ts` | 액션/이벤트/에러코드/payload 타입 전부 | ✅ 완료 |
| `src/bridge/injectedBridge.ts` | `window.PuppyNoteBridge` 주입 스크립트 생성 | ✅ 완료 |
| `src/bridge/BridgeException.ts` | 에러 정규화 | ✅ 완료 |
| `src/bridge/useBridge.ts` | 메시지 라우팅, 이벤트 발행, 뒤로가기 ack | ✅ 완료 |
| `src/bridge/handlers/authHandlers.ts` | `LOGIN_KAKAO`, `LOGIN_APPLE` | ✅ 완료 |
| `src/bridge/handlers/deviceHandlers.ts` | `GET_DEVICE_TOKEN`, `GET_APP_INFO`, `GET_NETWORK_STATE` | ✅ 완료 |
| `src/bridge/handlers/locationHandlers.ts` | `GET_LOCATION` | ✅ 완료 |
| `src/bridge/handlers/mediaHandlers.ts` | `PICK_IMAGE` | ✅ 완료 |
| `src/bridge/handlers/storageHandlers.ts` | `SET/GET/CLEAR_TOKEN` | ✅ 완료 |
| `src/bridge/handlers/systemHandlers.ts` | `OPEN_EXTERNAL`, `HAPTIC`, `EXIT_APP` | ✅ 완료 |
| `src/screens/webview/WebViewShellScreen.tsx` | WebView 쉘 | ✅ 완료 |
| `src/__tests__/bridge/injectedBridge.test.ts` | 주입 스크립트 왕복 테스트 13건 | ✅ 통과 |

**실기기 검증은 아직 안 됐습니다.** 모바일 웹 배포 URL이 나오면 실기기에서 액션별로 확인해야 합니다.

### 아직 열려 있는 것

1. **푸시 `data` 키 확정** — 백엔드가 `path`/`link`/`deepLink`/`url` 중 무엇으로 내려주는지 미확인. 현재는 4개 모두 수용.
2. **이미지 업로드 경로** — 지금은 base64로 웹에 넘겨 웹이 업로드합니다. 대용량 사진에서 문제가 되면 앱이 직접 업로드하고 URL만 돌려주는 `UPLOAD_IMAGE` 액션 추가를 검토해야 합니다.
3. **`SECURE_STORE_KEYS` 화이트리스트** — 웹이 더 필요한 키가 있으면 앱 배포가 필요합니다.
4. **세션 유지 방식** — 웹이 SecureStore를 쓸지, 쿠키를 쓸지 합의 필요. 현재 규약은 SecureStore 기준입니다.
5. **카메라 직접 촬영** — 현재 `PICK_IMAGE`는 사진첩만 엽니다. 카메라가 필요하면 알려주세요.

---

## 8. 앱 쉘 설정

```bash
# .env / .env.dev / .env.prd  (.env.example 참고)
EXPO_PUBLIC_WEB_URL=https://web.puppynote.co.kr
EXPO_PUBLIC_WEBVIEW_MODE=true
```

- `EXPO_PUBLIC_WEBVIEW_MODE`가 `true`가 아니면 앱은 **기존 네이티브 화면으로 그대로 동작**합니다.
  전체 화면 이식이 끝나기 전까지 기본값은 `false`입니다.
- `EXPO_PUBLIC_WEB_URL`이 비어 있으면 쉘이 "웹 주소가 설정되지 않았습니다" 안내 화면을 보여줍니다.
- 로컬 개발 시: Android 에뮬레이터는 `http://10.0.2.2:3000`, iOS 시뮬레이터는 `http://localhost:3000`.

### 쉘이 자동으로 처리하는 것

| 상황 | 동작 |
|---|---|
| 첫 로딩 | 스플래시가 화면을 덮음 (최소 800ms 노출 후 페이드아웃) |
| 페이지 전환 로딩 | 브랜드 색 스피너 오버레이 |
| 네트워크 실패 / 5xx | 재시도 버튼이 있는 에러 화면 |
| 웹 오리진 밖의 링크 | WebView 안에서 열지 않고 외부 브라우저/앱으로 전달 |
| Android 뒤로가기 | `HARDWARE_BACK` 이벤트로 웹에 위임 (§5-1) |

---

## 9. 문의

- 액션 추가/변경, payload 형식 협의: `ask_employee` → **네이티브 프론트 개발자**
- 디자인 토큰/화면 스펙: [`01-design-spec.md`](./01-design-spec.md)
