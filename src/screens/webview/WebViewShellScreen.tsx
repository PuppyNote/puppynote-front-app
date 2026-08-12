import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Platform, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import WebView, { WebViewNavigation } from 'react-native-webview';
// 루트 index.d.ts가 일부 타입만 re-export 해서 나머지는 lib에서 직접 가져옵니다.
import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';
import WebViewErrorView, {
  WebViewLoadError,
} from '../../components/webview/WebViewErrorView';
import WebViewSplash from '../../components/webview/WebViewSplash';
import {
  INTERNAL_ORIGINS,
  SPLASH_MIN_DURATION,
  WEB_URL,
  originOf,
} from '../../config/webview';
import { BRIDGE_UA_TAG } from '../../bridge/BridgeProtocol';
import { APP_VERSION } from '../../bridge/handlers/deviceHandlers';
import { useBridge } from '../../bridge/useBridge';

const NOT_CONFIGURED_ERROR: WebViewLoadError = {
  title: '웹 주소가 설정되지 않았습니다',
  message:
    '환경변수 EXPO_PUBLIC_WEB_URL에 모바일 웹 주소를 설정한 뒤 앱을 다시 실행해주세요.',
};

/**
 * 모바일 웹을 띄우는 전체화면 WebView 쉘.
 *
 * - 로딩 중에는 스플래시가 화면을 덮습니다 (최소 SPLASH_MIN_DURATION 노출).
 * - 로드 실패 시 재시도 버튼이 있는 에러 화면을 보여줍니다.
 * - Android 하드웨어 뒤로가기는 WebView의 goBack 대신 HARDWARE_BACK 이벤트로 웹에 위임합니다.
 *   웹이 처리하지 않으면(ack handled=false 또는 타임아웃) 여기서 goBack/앱종료로 폴백합니다.
 *
 * 관련 문서: docs/webview-migration/02-js-bridge-protocol.md
 */
export default function WebViewShellScreen() {
  const route = useRoute<any>();
  /** 로그인 화면의 "회원가입"/"비밀번호 찾기"처럼 특정 웹 경로로 바로 진입해야 할 때 씁니다. */
  const path: string = route.params?.path ?? '';
  const targetUrl = path ? `${WEB_URL}${path}` : WEB_URL;

  const webViewRef = useRef<WebView>(null);
  const canGoBackRef = useRef(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [isMinSplashElapsed, setIsMinSplashElapsed] = useState(false);
  const [error, setError] = useState<WebViewLoadError | null>(WEB_URL ? null : NOT_CONFIGURED_ERROR);
  /** 재시도 시 WebView를 완전히 새로 만들기 위한 키 */
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsMinSplashElapsed(true), SPLASH_MIN_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const isWebReady = isLoaded && !error;
  const showSplash = !error && !(isLoaded && isMinSplashElapsed);

  /** 웹이 HARDWARE_BACK을 처리하지 않았을 때의 기본 동작 */
  const handleUnhandledBack = useCallback(() => {
    if (canGoBackRef.current) {
      webViewRef.current?.goBack();
      return;
    }
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    }
  }, []);

  const { injectedJavaScript, onMessage } = useBridge({
    webViewRef,
    onUnhandledBack: handleUnhandledBack,
    isWebReady,
  });

  const handleRetry = useCallback(() => {
    if (!WEB_URL) {
      setError(NOT_CONFIGURED_ERROR);
      return;
    }
    setError(null);
    setIsLoaded(false);
    setIsSplashDone(false);
    setIsMinSplashElapsed(false);
    setReloadKey((key) => key + 1);
    setTimeout(() => setIsMinSplashElapsed(true), SPLASH_MIN_DURATION);
  }, []);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    canGoBackRef.current = navState.canGoBack;
  }, []);

  const handleError = useCallback((event: WebViewErrorEvent) => {
    const { description, code } = event.nativeEvent;
    setError({
      title: '페이지를 불러오지 못했습니다',
      message: '네트워크 상태를 확인한 뒤 다시 시도해주세요.',
      detail: `[${code}] ${description}`,
    });
  }, []);

  const handleHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    const { statusCode, url } = event.nativeEvent;
    // 이미지/스크립트 등 서브 리소스 404까지 전체 에러 화면으로 만들지 않습니다.
    if (originOf(url) !== originOf(WEB_URL) || statusCode < 500) {
      return;
    }
    setError({
      title: '서버에 문제가 발생했습니다',
      message: '잠시 후 다시 시도해주세요.',
      detail: `HTTP ${statusCode}`,
    });
  }, []);

  /**
   * 우리 웹 오리진 밖의 링크는 WebView 안에서 열지 않고 외부 브라우저/앱으로 넘깁니다.
   * (카카오/애플 로그인은 브릿지 액션으로 처리하므로 WebView 안에서 OAuth 페이지를 열 일이 없습니다.)
   */
  const handleShouldStartLoad = useCallback((request: WebViewNavigation) => {
    const { url } = request;
    if (!url || url === 'about:blank') return true;

    const origin = originOf(url);
    if (!origin || INTERNAL_ORIGINS.includes(origin)) return true;

    if (/^https?:/i.test(url)) {
      void Linking.openURL(url).catch(() => undefined);
      return false;
    }

    // mailto:, tel:, intent: 등
    void Linking.canOpenURL(url)
      .then((supported) => (supported ? Linking.openURL(url) : undefined))
      .catch(() => undefined);
    return false;
  }, []);

  return (
    // 'top'을 빼서 상태바 아래까지 WebView가 꽉 채우게 합니다. 모바일 웹이
    // viewport-fit=cover + env(safe-area-inset-top) CSS로 자체 처리합니다.
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar style="dark" translucent />

      {!!WEB_URL && !error && (
        <WebView
          key={reloadKey}
          ref={webViewRef}
          source={{ uri: targetUrl }}
          style={styles.webView}
          // 브릿지는 웹의 어떤 코드보다 먼저 들어가야 합니다.
          injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
          onMessage={onMessage}
          onLoadEnd={() => setIsLoaded(true)}
          onError={handleError}
          onHttpError={handleHttpError}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          // 웹이 앱 내부임을 서버 사이드에서도 알 수 있게 UA에 태그를 붙입니다.
          applicationNameForUserAgent={`${BRIDGE_UA_TAG}/${APP_VERSION}`}
          allowsBackForwardNavigationGestures={false}
          domStorageEnabled
          javaScriptEnabled
          // 앱 내부 뒤로가기는 브릿지가 제어하므로 WebView 자체 제스처는 끕니다.
          setSupportMultipleWindows={false}
          originWhitelist={['https://*', 'http://*']}
          startInLoadingState={false}
          // iOS에서 웹 콘텐츠가 노치 영역까지 밀려 들어가지 않도록 합니다.
          contentInsetAdjustmentBehavior="never"
          overScrollMode="never"
          bounces={false}
        />
      )}

      {!!error && <WebViewErrorView error={error} onRetry={handleRetry} />}

      {!isSplashDone && (
        <WebViewSplash visible={showSplash} onHidden={() => setIsSplashDone(true)} />
      )}

      {/* 스플래시가 걷힌 뒤의 페이지 전환 로딩 표시 */}
      {isSplashDone && !isLoaded && !error && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#eebd2b" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfaf2',
  },
  webView: {
    flex: 1,
    backgroundColor: '#fcfaf2',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
