import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState, AppStateStatus, BackHandler, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Network from 'expo-network';
import type WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { toBridgeError } from './BridgeException';
import {
  BRIDGE_ENVELOPE_VERSION,
  BridgeAckMessage,
  BridgeEvent,
  BridgeEventMessage,
  BridgeInboundMessage,
  BridgeRequestMessage,
  BridgeResponseMessage,
  HARDWARE_BACK_ACK_TIMEOUT,
  PushOpenedEventPayload,
} from './BridgeProtocol';
import { bridgeHandlers } from './handlers';
import { APP_PLATFORM, APP_VERSION } from './handlers/deviceHandlers';
import {
  SUPPORTED_ACTIONS,
  SUPPORTED_EVENTS,
  buildDispatchScript,
  buildInjectedBridgeScript,
} from './injectedBridge';

interface UseBridgeOptions {
  /** WebView 인스턴스 ref */
  webViewRef: React.RefObject<WebView | null>;
  /**
   * 웹이 HARDWARE_BACK을 처리하지 않았을 때(또는 브릿지 미준비) 실행할 기본 동작.
   * 보통 WebView.goBack() 또는 앱 종료입니다.
   */
  onUnhandledBack: () => void;
  /** 브릿지가 웹으로 메시지를 보낼 수 있는 상태인지. 로딩 완료 후 true로 올려주세요. */
  isWebReady: boolean;
}

let eventSeq = 0;
function nextEventId(): string {
  eventSeq += 1;
  return `evt-${eventSeq}-${Date.now()}`;
}

/** 푸시 payload에서 웹이 이동할 경로를 뽑아냅니다. 키 이름은 백엔드와 합의된 것 우선. */
function extractPushPath(data: Record<string, unknown>): string | null {
  const candidates = ['path', 'link', 'deepLink', 'url'];
  for (const key of candidates) {
    const value = data?.[key];
    if (typeof value === 'string' && value.trim()) {
      // 'puppynote://walk/12' 같은 스킴 형태도 경로만 남깁니다.
      const withoutScheme = value.replace(/^[a-z]+:\/\//i, '/');
      return withoutScheme.startsWith('/') ? withoutScheme : `/${withoutScheme}`;
    }
  }
  return null;
}

function toPushPayload(data: Record<string, unknown>): PushOpenedEventPayload {
  const params: Record<string, string> = {};
  Object.entries(data ?? {}).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      params[key] = String(value);
    }
  });
  return { path: extractPushPath(data), params, raw: data ?? {} };
}

/**
 * WebView와 네이티브 기능을 잇는 JS Bridge 훅.
 *
 * - 웹 -> 앱: `onMessage`로 받은 request를 핸들러 레지스트리로 넘기고 response를 돌려줍니다.
 * - 앱 -> 웹: `emitEvent`로 이벤트를 밀어 넣습니다. HARDWARE_BACK만 ack를 기다립니다.
 *
 * 규약: docs/webview-migration/02-js-bridge-protocol.md
 */
export function useBridge({ webViewRef, onUnhandledBack, isWebReady }: UseBridgeOptions) {
  /** HARDWARE_BACK ack 대기중인 resolver들 */
  const pendingAcks = useRef<Map<string, (handled: boolean) => void>>(new Map());
  const isWebReadyRef = useRef(isWebReady);
  const onUnhandledBackRef = useRef(onUnhandledBack);

  useEffect(() => {
    isWebReadyRef.current = isWebReady;
  }, [isWebReady]);

  useEffect(() => {
    onUnhandledBackRef.current = onUnhandledBack;
  }, [onUnhandledBack]);

  const injectedJavaScript = useMemo(
    () =>
      buildInjectedBridgeScript({
        platform: APP_PLATFORM,
        appVersion: APP_VERSION,
        supportedActions: SUPPORTED_ACTIONS,
        supportedEvents: SUPPORTED_EVENTS,
      }),
    [],
  );

  const post = useCallback(
    (message: BridgeResponseMessage | BridgeEventMessage) => {
      webViewRef.current?.injectJavaScript(buildDispatchScript(message));
    },
    [webViewRef],
  );

  /** 앱 -> 웹 단방향 이벤트 */
  const emitEvent = useCallback(
    (event: string, payload?: unknown) => {
      if (!isWebReadyRef.current) return;
      post({ v: BRIDGE_ENVELOPE_VERSION, type: 'event', event, payload });
    },
    [post],
  );

  /**
   * 앱 -> 웹 이벤트를 보내고 웹이 처리했는지 ack를 기다립니다.
   * 타임아웃되면 false(웹이 처리 못 함)로 간주합니다.
   */
  const emitEventWithAck = useCallback(
    (event: string, payload: unknown, timeoutMs: number): Promise<boolean> => {
      if (!isWebReadyRef.current) return Promise.resolve(false);

      const id = nextEventId();
      return new Promise<boolean>((resolve) => {
        let settled = false;
        const settle = (handled: boolean) => {
          if (settled) return;
          settled = true;
          pendingAcks.current.delete(id);
          resolve(handled);
        };

        pendingAcks.current.set(id, settle);
        setTimeout(() => settle(false), timeoutMs);
        post({ v: BRIDGE_ENVELOPE_VERSION, type: 'event', event, id, payload });
      });
    },
    [post],
  );

  const handleRequest = useCallback(
    async (message: BridgeRequestMessage) => {
      const { id, action, payload } = message;
      const handler = bridgeHandlers[action];

      const respond = (result: Omit<BridgeResponseMessage, 'v' | 'type' | 'id' | 'action'>) =>
        post({ v: BRIDGE_ENVELOPE_VERSION, type: 'response', id, action, ...result });

      if (!handler) {
        // 웹이 신버전이고 앱이 구버전인 경우. 웹은 이 코드를 보고 폴백해야 합니다.
        respond({
          ok: false,
          error: {
            code: 'UNSUPPORTED_ACTION',
            message: `이 앱 버전(${APP_VERSION})은 ${action} 액션을 지원하지 않습니다.`,
          },
        });
        return;
      }

      try {
        const data = await handler(payload as never, {
          requestId: id,
          exitApp: () => BackHandler.exitApp(),
        });
        respond({ ok: true, data });
      } catch (error) {
        respond({ ok: false, error: toBridgeError(error) });
      }
    },
    [post],
  );

  const handleAck = useCallback((message: BridgeAckMessage) => {
    const settle = pendingAcks.current.get(message.id);
    if (settle) settle(message.handled === true);
  }, []);

  /** WebView의 onMessage에 그대로 연결하세요. */
  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let message: BridgeInboundMessage;
      try {
        message = JSON.parse(event.nativeEvent.data);
      } catch {
        // 브릿지 규약과 무관한 메시지는 무시합니다.
        return;
      }

      if (!message || typeof message !== 'object') return;

      if (message.type === 'request') {
        void handleRequest(message);
      } else if (message.type === 'ack') {
        handleAck(message);
      }
    },
    [handleAck, handleRequest],
  );

  // --- Android 하드웨어 뒤로가기 -------------------------------------------
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      // 항상 true를 반환해 WebView의 기본 goBack을 막고, 웹에 판단을 위임합니다.
      void emitEventWithAck(BridgeEvent.HARDWARE_BACK, {}, HARDWARE_BACK_ACK_TIMEOUT).then(
        (handled) => {
          if (!handled) onUnhandledBackRef.current();
        },
      );
      return true;
    });

    return () => subscription.remove();
  }, [emitEventWithAck]);

  // --- 앱 상태 (포그라운드/백그라운드) -------------------------------------
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      emitEvent(BridgeEvent.APP_STATE, { state });
    });
    return () => subscription.remove();
  }, [emitEvent]);

  // --- 네트워크 상태 -------------------------------------------------------
  useEffect(() => {
    const subscription = Network.addNetworkStateListener((state) => {
      emitEvent(BridgeEvent.NETWORK_STATE, {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? null,
        type: state.type ?? 'UNKNOWN',
      });
    });
    return () => subscription.remove();
  }, [emitEvent]);

  // --- 푸시 알림 탭 --------------------------------------------------------
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = (response.notification.request.content.data ?? {}) as Record<string, unknown>;
      emitEvent(BridgeEvent.PUSH_OPENED, toPushPayload(data));
    });
    return () => subscription.remove();
  }, [emitEvent]);

  /**
   * 앱이 완전히 종료된 상태에서 푸시로 실행된 경우, 위 리스너는 이미 지난 이벤트를 받지 못합니다.
   * 웹이 준비된 뒤 한 번 조회해 흘려보내지 않도록 합니다.
   * (웹 쪽 브릿지에도 리스너 등록 전 이벤트를 보관하는 replay 버퍼가 있습니다.)
   */
  useEffect(() => {
    if (!isWebReady) return;
    let cancelled = false;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (cancelled || !response) return;
      const data = (response.notification.request.content.data ?? {}) as Record<string, unknown>;
      const payload = toPushPayload(data);
      if (payload.path) {
        emitEvent(BridgeEvent.PUSH_OPENED, payload);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isWebReady, emitEvent]);

  return { injectedJavaScript, onMessage, emitEvent, emitEventWithAck };
}
