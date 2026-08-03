# 웹뷰 전환 프로젝트 문서

네이티브 앱(`puppynote-front-app`)의 화면 렌더링을 모바일 웹(`puppynote-front-web`)으로 옮기고,
앱은 WebView를 띄우는 얇은 쉘 + 네이티브 전용 기능만 제공하는 구조로 전환하는 작업의 문서입니다.

## 문서

| 문서 | 내용 | 주 독자 |
|---|---|---|
| [01-design-spec.md](./01-design-spec.md) | 디자인 토큰 정리 + **실제 화면 코드 기준** 색상/타이포/여백 대조표, 화면 목록, 에셋 목록 | 모바일 웹 개발자 |
| [02-js-bridge-protocol.md](./02-js-bridge-protocol.md) | 웹↔앱 JS Bridge 규약 v1.0.0 (액션/이벤트/에러/버전 협상) + 네이티브 구현 현황 | 모바일 웹 개발자 |

## 단계

- **Phase 0 (현재)** — 디자인 스펙 정리, 브릿지 규약 초안, 브릿지/쉘 기초 구현
- Phase 1 이후 — 화면별 이식 (별도 티켓)

## 앱 쪽 코드 위치

```
src/bridge/                     JS Bridge (프로토콜 정의 + 주입 스크립트 + 액션 핸들러)
  BridgeProtocol.ts             액션/이벤트/에러코드/payload 타입 — 규약의 단일 출처
  injectedBridge.ts             window.PuppyNoteBridge 주입 스크립트 생성
  BridgeException.ts            에러 정규화
  useBridge.ts                  메시지 라우팅 + 이벤트 발행 + 뒤로가기 ack
  handlers/                     액션별 핸들러 (auth/device/location/media/storage/system)
src/screens/webview/            WebView 쉘 화면
src/components/webview/         쉘 전용 스플래시/에러 뷰
src/config/webview.ts           웹 URL, 웹뷰 모드 등 환경변수 설정
src/__tests__/bridge/           주입 스크립트 왕복 테스트
```

## 실행

```bash
# .env.example 참고해 .env 설정 후
EXPO_PUBLIC_WEB_URL=http://10.0.2.2:3000 EXPO_PUBLIC_WEBVIEW_MODE=true npm run android
```

`EXPO_PUBLIC_WEBVIEW_MODE`가 `true`가 아니면 기존 네이티브 화면으로 그대로 동작합니다.
