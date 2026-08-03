/**
 * WebView에 주입되는 `window.PuppyNoteBridge` 구현.
 *
 * 이 파일이 만들어내는 스크립트는 웹 페이지의 어떤 코드보다 먼저(injectedJavaScriptBeforeContentLoaded)
 * 실행되므로, 웹은 첫 렌더 시점부터 `window.PuppyNoteBridge` 존재 여부로 앱 내부/일반 브라우저를
 * 구분할 수 있습니다.
 *
 * 규약: docs/webview-migration/02-js-bridge-protocol.md
 */
import {
  BRIDGE_DEFAULT_TIMEOUT,
  BRIDGE_ENVELOPE_VERSION,
  BRIDGE_GLOBAL_NAME,
  BRIDGE_VERSION,
  BridgeAction,
  BridgeEvent,
} from './BridgeProtocol';

export interface InjectedBridgeConfig {
  platform: 'ios' | 'android';
  appVersion: string;
  supportedActions: string[];
  supportedEvents: string[];
}

/**
 * 임의의 값을 `injectJavaScript`에 안전하게 끼워넣을 수 있는 JS 리터럴 문자열로 변환합니다.
 * JSON에서는 허용되지만 JS 문자열 리터럴에서는 문제가 될 수 있는 U+2028/U+2029까지 이스케이프합니다.
 */
const JS_UNSAFE_JSON_CHARS = new RegExp('[' + String.fromCharCode(0x2028, 0x2029) + ']', 'g');
const BACKSLASH = String.fromCharCode(92);

export function toJsLiteral(value: unknown): string {
  return JSON.stringify(JSON.stringify(value)).replace(JS_UNSAFE_JSON_CHARS, (c) =>
    c.charCodeAt(0) === 0x2028 ? BACKSLASH + 'u2028' : BACKSLASH + 'u2029',
  );
}

/**
 * 네이티브에서 웹으로 메시지를 보낼 때 `webViewRef.injectJavaScript()`에 넘길 스크립트를 만듭니다.
 * 브릿지가 아직 주입되지 않은 상태(초기 로딩 등)에서도 예외가 나지 않도록 방어합니다.
 */
export function buildDispatchScript(message: unknown): string {
  return `(function(){try{window.${BRIDGE_GLOBAL_NAME}&&window.${BRIDGE_GLOBAL_NAME}.__receive(${toJsLiteral(
    message,
  )});}catch(e){}})();true;`;
}

/**
 * `injectedJavaScriptBeforeContentLoaded`에 넣을 브릿지 본체 스크립트.
 */
export function buildInjectedBridgeScript(config: InjectedBridgeConfig): string {
  const meta = {
    version: BRIDGE_VERSION,
    envelopeVersion: BRIDGE_ENVELOPE_VERSION,
    platform: config.platform,
    appVersion: config.appVersion,
    supportedActions: config.supportedActions,
    supportedEvents: config.supportedEvents,
    defaultTimeout: BRIDGE_DEFAULT_TIMEOUT,
  };

  // 아래 문자열은 WebView(웹 브라우저) 안에서 실행되는 코드입니다.
  // RN이 아닌 브라우저 환경이므로 ES5 수준 문법만 사용합니다.
  return `
(function () {
  if (window.${BRIDGE_GLOBAL_NAME}) { return; }

  var META = ${toJsLiteral(meta)};
  var meta = JSON.parse(META);
  var ENVELOPE_V = meta.envelopeVersion;
  var HARDWARE_BACK = ${JSON.stringify(BridgeEvent.HARDWARE_BACK)};

  var pending = {};      // id -> { resolve, reject, timer }
  var listeners = {};    // eventName -> [handler]
  var replayBuffer = []; // 리스너 등록 전에 도착한 이벤트 보관

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function post(message) {
    if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
      return false;
    }
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
    return true;
  }

  function makeError(code, message) {
    var e = new Error(message);
    e.name = 'PuppyNoteBridgeError';
    e.code = code;
    return e;
  }

  function request(action, payload, options) {
    var opts = options || {};
    return new Promise(function (resolve, reject) {
      if (meta.supportedActions.indexOf(action) === -1) {
        // 앱이 이 액션을 모르는 구버전일 수 있습니다. 웹은 이 코드를 보고 폴백하세요.
        reject(makeError('UNSUPPORTED_ACTION', action + ' is not supported by app ' + meta.appVersion));
        return;
      }

      var id = uuid();
      var sent = post({
        v: ENVELOPE_V,
        type: 'request',
        id: id,
        action: action,
        payload: payload === undefined ? null : payload
      });

      if (!sent) {
        reject(makeError('INTERNAL_ERROR', 'ReactNativeWebView bridge is not available'));
        return;
      }

      var timeoutMs = typeof opts.timeout === 'number' ? opts.timeout : meta.defaultTimeout;
      var timer = null;
      if (timeoutMs > 0) {
        timer = setTimeout(function () {
          delete pending[id];
          reject(makeError('TIMEOUT', action + ' timed out after ' + timeoutMs + 'ms'));
        }, timeoutMs);
      }

      pending[id] = { resolve: resolve, reject: reject, timer: timer };
    });
  }

  function on(eventName, handler) {
    if (typeof handler !== 'function') { return function () {}; }
    if (!listeners[eventName]) { listeners[eventName] = []; }
    listeners[eventName].push(handler);

    // 리스너 등록 전에 도착해 버린 이벤트를 흘려보내지 않고 재생합니다.
    // (푸시로 앱이 켜진 직후 PUSH_OPENED가 웹 JS보다 먼저 오는 경우)
    var replay = replayBuffer.filter(function (m) { return m.event === eventName; });
    replayBuffer = replayBuffer.filter(function (m) { return m.event !== eventName; });
    replay.forEach(function (m) {
      try { handler(m.payload); } catch (e) {}
    });

    return function off() {
      var arr = listeners[eventName] || [];
      var i = arr.indexOf(handler);
      if (i >= 0) { arr.splice(i, 1); }
    };
  }

  function off(eventName, handler) {
    var arr = listeners[eventName] || [];
    var i = arr.indexOf(handler);
    if (i >= 0) { arr.splice(i, 1); }
  }

  function emit(message) {
    var handlers = (listeners[message.event] || []).slice();

    if (!handlers.length) {
      // ack가 필요한 이벤트는 "처리 못 했다"고 즉시 알려 앱이 기본 동작을 하도록 합니다.
      if (message.id) {
        post({ v: ENVELOPE_V, type: 'ack', id: message.id, handled: false });
      } else {
        replayBuffer.push(message);
        if (replayBuffer.length > 20) { replayBuffer.shift(); }
      }
      return;
    }

    var handled = false;
    for (var i = 0; i < handlers.length; i++) {
      try {
        // 핸들러가 true를 반환하면 "웹이 처리했다"는 뜻입니다.
        if (handlers[i](message.payload) === true) { handled = true; }
      } catch (e) {}
    }

    if (message.id) {
      post({ v: ENVELOPE_V, type: 'ack', id: message.id, handled: handled });
    }
  }

  function receive(raw) {
    var message;
    try {
      message = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
      return;
    }
    if (!message || typeof message !== 'object') { return; }

    if (message.type === 'response') {
      var entry = pending[message.id];
      if (!entry) { return; }
      delete pending[message.id];
      if (entry.timer) { clearTimeout(entry.timer); }
      if (message.ok) {
        entry.resolve(message.data === undefined ? null : message.data);
      } else {
        var err = message.error || {};
        entry.reject(makeError(err.code || 'INTERNAL_ERROR', err.message || 'Bridge request failed'));
      }
      return;
    }

    if (message.type === 'event') {
      emit(message);
    }
  }

  var bridge = {
    version: meta.version,
    envelopeVersion: meta.envelopeVersion,
    platform: meta.platform,
    appVersion: meta.appVersion,
    supportedActions: meta.supportedActions,
    supportedEvents: meta.supportedEvents,
    isSupported: function (action) { return meta.supportedActions.indexOf(action) !== -1; },
    request: request,
    on: on,
    off: off,
    /** 네이티브 전용 진입점. 웹에서 직접 호출하지 마세요. */
    __receive: receive
  };

  Object.defineProperty(window, '${BRIDGE_GLOBAL_NAME}', {
    value: bridge,
    writable: false,
    configurable: false,
    enumerable: true
  });

  // 웹이 스크립트 로드 순서와 무관하게 브릿지 준비를 감지할 수 있도록 이벤트도 쏩니다.
  try {
    window.dispatchEvent(new Event('puppynotebridgeready'));
  } catch (e) {}

  // 하드웨어 뒤로가기를 아무도 구독하지 않은 경우를 위한 힌트 (웹이 참고용으로 읽을 수 있음)
  bridge.HARDWARE_BACK = HARDWARE_BACK;
})();
true;
`;
}

/** 앱이 실제로 처리할 수 있는 액션 목록 (핸들러 레지스트리와 동기화되어야 함) */
export const SUPPORTED_ACTIONS: string[] = Object.values(BridgeAction);

/** 앱이 발행하는 이벤트 목록 */
export const SUPPORTED_EVENTS: string[] = Object.values(BridgeEvent);
