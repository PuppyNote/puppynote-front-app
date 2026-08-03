import {
  SUPPORTED_ACTIONS,
  SUPPORTED_EVENTS,
  buildDispatchScript,
  buildInjectedBridgeScript,
  toJsLiteral,
} from '../../bridge/injectedBridge';
import { BRIDGE_ENVELOPE_VERSION, BridgeAction, BridgeEvent } from '../../bridge/BridgeProtocol';

/**
 * 주입 스크립트는 WebView(브라우저) 안에서 도는 코드라 RN 테스트로는 잡히지 않습니다.
 * 여기서는 가짜 window를 만들어 실제로 실행시켜 request/response/event 왕복을 검증합니다.
 */
interface FakeBridge {
  version: string;
  platform: string;
  supportedActions: string[];
  isSupported: (action: string) => boolean;
  request: (action: string, payload?: unknown, options?: { timeout?: number }) => Promise<unknown>;
  on: (event: string, handler: (payload: unknown) => unknown) => () => void;
  __receive: (raw: string) => void;
}

function setupBridge() {
  const posted: any[] = [];
  const fakeWindow: any = {
    ReactNativeWebView: {
      postMessage: (raw: string) => posted.push(JSON.parse(raw)),
    },
    crypto: undefined,
    dispatchEvent: () => true,
  };

  const script = buildInjectedBridgeScript({
    platform: 'android',
    appVersion: '1.0.2',
    supportedActions: SUPPORTED_ACTIONS,
    supportedEvents: SUPPORTED_EVENTS,
  });

  // eslint-disable-next-line no-new-func
  new Function('window', 'setTimeout', 'clearTimeout', 'Promise', script)(
    fakeWindow,
    setTimeout,
    clearTimeout,
    Promise,
  );

  return { bridge: fakeWindow.PuppyNoteBridge as FakeBridge, posted, fakeWindow };
}

/** 네이티브가 injectJavaScript로 보내는 스크립트를 그대로 실행해 웹에 전달합니다. */
function deliver(fakeWindow: any, message: unknown) {
  // eslint-disable-next-line no-new-func
  new Function('window', buildDispatchScript(message))(fakeWindow);
}

describe('injectedBridge', () => {
  it('window.PuppyNoteBridge를 노출하고 메타 정보를 담는다', () => {
    const { bridge } = setupBridge();

    expect(bridge).toBeDefined();
    expect(bridge.platform).toBe('android');
    expect(bridge.supportedActions).toEqual(expect.arrayContaining(Object.values(BridgeAction)));
  });

  it('isSupported로 미지원 액션을 구분한다', () => {
    const { bridge } = setupBridge();

    expect(bridge.isSupported(BridgeAction.GET_LOCATION)).toBe(true);
    expect(bridge.isSupported('SOME_FUTURE_ACTION')).toBe(false);
  });

  it('request가 uuid를 붙여 postMessage하고 응답으로 resolve된다', async () => {
    const { bridge, posted, fakeWindow } = setupBridge();

    const promise = bridge.request(BridgeAction.GET_TOKEN, { key: 'accessToken' });

    expect(posted).toHaveLength(1);
    const sent = posted[0];
    expect(sent.v).toBe(BRIDGE_ENVELOPE_VERSION);
    expect(sent.type).toBe('request');
    expect(sent.action).toBe(BridgeAction.GET_TOKEN);
    expect(typeof sent.id).toBe('string');
    expect(sent.id.length).toBeGreaterThan(0);

    deliver(fakeWindow, {
      v: BRIDGE_ENVELOPE_VERSION,
      type: 'response',
      id: sent.id,
      action: BridgeAction.GET_TOKEN,
      ok: true,
      data: { key: 'accessToken', value: 'abc' },
    });

    await expect(promise).resolves.toEqual({ key: 'accessToken', value: 'abc' });
  });

  it('id가 다른 응답은 매칭되지 않는다', async () => {
    const { bridge, posted, fakeWindow } = setupBridge();

    const promise = bridge.request(BridgeAction.HAPTIC, {}, { timeout: 60 });
    deliver(fakeWindow, {
      v: BRIDGE_ENVELOPE_VERSION,
      type: 'response',
      id: `${posted[0].id}-other`,
      action: BridgeAction.HAPTIC,
      ok: true,
      data: {},
    });

    await expect(promise).rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('ok:false 응답은 code를 가진 에러로 reject된다', async () => {
    const { bridge, posted, fakeWindow } = setupBridge();

    const promise = bridge.request(BridgeAction.GET_LOCATION);
    deliver(fakeWindow, {
      v: BRIDGE_ENVELOPE_VERSION,
      type: 'response',
      id: posted[0].id,
      action: BridgeAction.GET_LOCATION,
      ok: false,
      error: { code: 'PERMISSION_DENIED', message: '위치 권한이 거부되었습니다.' },
    });

    await expect(promise).rejects.toMatchObject({
      code: 'PERMISSION_DENIED',
      message: '위치 권한이 거부되었습니다.',
    });
  });

  it('타임아웃이 지나면 TIMEOUT으로 reject된다', async () => {
    const { bridge } = setupBridge();

    await expect(bridge.request(BridgeAction.PICK_IMAGE, null, { timeout: 30 })).rejects.toMatchObject(
      { code: 'TIMEOUT' },
    );
  });

  it('미지원 액션은 postMessage 없이 UNSUPPORTED_ACTION으로 reject된다', async () => {
    const { bridge, posted } = setupBridge();

    await expect(bridge.request('SOME_FUTURE_ACTION')).rejects.toMatchObject({
      code: 'UNSUPPORTED_ACTION',
    });
    expect(posted).toHaveLength(0);
  });

  it('이벤트를 구독한 핸들러에 payload가 전달된다', () => {
    const { bridge, fakeWindow } = setupBridge();
    const handler = jest.fn();
    bridge.on(BridgeEvent.APP_STATE, handler);

    deliver(fakeWindow, {
      v: BRIDGE_ENVELOPE_VERSION,
      type: 'event',
      event: BridgeEvent.APP_STATE,
      payload: { state: 'active' },
    });

    expect(handler).toHaveBeenCalledWith({ state: 'active' });
  });

  it('HARDWARE_BACK 핸들러가 true를 반환하면 handled:true로 ack한다', () => {
    const { bridge, posted, fakeWindow } = setupBridge();
    bridge.on(BridgeEvent.HARDWARE_BACK, () => true);

    deliver(fakeWindow, {
      v: BRIDGE_ENVELOPE_VERSION,
      type: 'event',
      event: BridgeEvent.HARDWARE_BACK,
      id: 'evt-1',
      payload: {},
    });

    expect(posted).toEqual([
      { v: BRIDGE_ENVELOPE_VERSION, type: 'ack', id: 'evt-1', handled: true },
    ]);
  });

  it('HARDWARE_BACK 구독자가 없으면 즉시 handled:false로 ack한다', () => {
    const { posted, fakeWindow } = setupBridge();

    deliver(fakeWindow, {
      v: BRIDGE_ENVELOPE_VERSION,
      type: 'event',
      event: BridgeEvent.HARDWARE_BACK,
      id: 'evt-2',
      payload: {},
    });

    expect(posted).toEqual([
      { v: BRIDGE_ENVELOPE_VERSION, type: 'ack', id: 'evt-2', handled: false },
    ]);
  });

  it('리스너 등록 전에 도착한 PUSH_OPENED는 나중에 재생된다', () => {
    const { bridge, fakeWindow } = setupBridge();

    deliver(fakeWindow, {
      v: BRIDGE_ENVELOPE_VERSION,
      type: 'event',
      event: BridgeEvent.PUSH_OPENED,
      payload: { path: '/walk/12', params: {}, raw: {} },
    });

    const handler = jest.fn();
    bridge.on(BridgeEvent.PUSH_OPENED, handler);

    expect(handler).toHaveBeenCalledWith({ path: '/walk/12', params: {}, raw: {} });
  });

  it('브릿지 규약과 무관한 메시지는 무시한다', () => {
    const { bridge, fakeWindow } = setupBridge();
    const handler = jest.fn();
    bridge.on(BridgeEvent.APP_STATE, handler);

    expect(() => bridge.__receive('not json')).not.toThrow();
    expect(() => deliver(fakeWindow, { hello: 'world' })).not.toThrow();
    expect(handler).not.toHaveBeenCalled();
  });

  it('toJsLiteral은 U+2028/U+2029를 이스케이프한다', () => {
    const raw = `a${String.fromCharCode(0x2028)}b${String.fromCharCode(0x2029)}c`;
    const literal = toJsLiteral({ raw });

    expect(literal).not.toContain(String.fromCharCode(0x2028));
    expect(literal).not.toContain(String.fromCharCode(0x2029));
    // 이스케이프된 리터럴을 다시 평가하면 원래 값이 나와야 합니다.
    // eslint-disable-next-line no-new-func
    expect(JSON.parse(new Function(`return ${literal};`)())).toEqual({ raw });
  });
});
