import Constants from 'expo-constants';

/**
 * WebView 쉘 설정.
 *
 * 모바일 웹(puppynote-front-web) 배포 URL이 아직 없을 수 있으므로 전부 환경변수로 뺐습니다.
 * `.env` / `.env.dev` / `.env.prd`에 아래 값을 넣으세요.
 *
 *   EXPO_PUBLIC_WEB_URL=https://web.puppynote.co.kr
 *   EXPO_PUBLIC_WEBVIEW_MODE=true
 *
 * `EXPO_PUBLIC_WEBVIEW_MODE`가 true가 아니면 앱은 기존 네이티브 화면으로 그대로 동작합니다.
 * (전체 화면 이식이 끝나기 전까지 기본값은 off입니다.)
 */

/** 모바일 웹 진입 URL. 비어 있으면 쉘이 설정 안내 화면을 보여줍니다. */
export const WEB_URL: string = (
  process.env.EXPO_PUBLIC_WEB_URL ??
  (Constants.expoConfig?.extra?.webUrl as string | undefined) ??
  ''
).trim();

/** true면 앱 진입 시 네이티브 화면 대신 WebView 쉘로 들어갑니다. */
export const WEBVIEW_MODE: boolean =
  String(
    process.env.EXPO_PUBLIC_WEBVIEW_MODE ??
      (Constants.expoConfig?.extra?.webViewMode as string | undefined) ??
      'false',
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
