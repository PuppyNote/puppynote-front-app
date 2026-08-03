/**
 * 브릿지 액션 핸들러 시그니처.
 *
 * - 반환값은 그대로 응답의 `data`가 됩니다.
 * - 실패는 `BridgeException`을 throw 하세요. 그 외 예외는 INTERNAL_ERROR로 감싸집니다.
 */
export type BridgeHandler<P = unknown, D = unknown> = (
  payload: P,
  context: BridgeHandlerContext,
) => Promise<D>;

export interface BridgeHandlerContext {
  /** 요청 매칭용 uuid (로깅용) */
  requestId: string;
  /** 앱을 종료시킵니다. EXIT_APP 등에서 사용. */
  exitApp: () => void;
}

export type BridgeHandlerMap = Record<string, BridgeHandler<any, any>>;
