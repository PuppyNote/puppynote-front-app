import Constants from 'expo-constants';

/**
 * WebView 쉘 설정.
 *
 * 모바일 웹(front.puppynote.co.kr)이 배포되어 앱 진입점을 WebView 쉘로 바꿨습니다.
 * 기본값은 프로덕션 웹 주소 + 웹뷰 모드 on 입니다. 로컬 개발 중 다른 웹 서버(로컬호스트 등)를
 * 보거나 네이티브 화면으로 잠시 되돌리고 싶으면 `.env` / `.env.dev` / `.env.prd`에서 덮어쓰세요.
 *
 *   EXPO_PUBLIC_WEB_URL=http://10.0.2.2:3000
 *   EXPO_PUBLIC_WEBVIEW_MODE=false
 */

/** 모바일 웹 진입 URL. 비어 있으면 쉘이 설정 안내 화면을 보여줍니다. */
export const WEB_URL: string = (
  process.env.EXPO_PUBLIC_WEB_URL ??
  (Constants.expoConfig?.extra?.webUrl as string | undefined) ??
  'https://front.puppynote.co.kr'
).trim();

/** true면 앱 진입 시 네이티브 화면 대신 WebView 쉘로 들어갑니다. */
export const WEBVIEW_MODE: boolean =
  String(
    process.env.EXPO_PUBLIC_WEBVIEW_MODE ??
      (Constants.expoConfig?.extra?.webViewMode as string | undefined) ??
      'true',
  ).toLowerCase() === 'true';

/**
 * URL에서 오리진(scheme://host[:port])만 뽑습니다.
 * React Native의 `URL` 폴리필은 파싱이 불완전해서 직접 처리합니다.
 */
export function originOf(url: string): string {
  const match = /^([a-z][a-z0-9+.-]*:\/\/[^/?#]+)/i.exec(url.trim());
  return match ? match[1].toLowerCase() : '';
}

/** WebView 안에서 계속 열어도 되는 오리진 목록. 그 밖의 링크는 외부 브라우저로 보냅니다. */
export const INTERNAL_ORIGINS: string[] = [WEB_URL].map(originOf).filter(Boolean);

/** 스플래시 최소 노출 시간(ms). 로딩이 빨라도 화면이 깜빡이지 않게 합니다. */
export const SPLASH_MIN_DURATION = 800;
