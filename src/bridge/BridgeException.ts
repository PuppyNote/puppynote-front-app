import { BridgeError, BridgeErrorCode, BridgeErrorCodeType } from './BridgeProtocol';

/**
 * 핸들러가 던지면 브릿지가 그대로 `error` 필드에 담아 웹에 돌려주는 예외.
 * 이 타입이 아닌 예외는 전부 INTERNAL_ERROR로 감싸집니다.
 */
export class BridgeException extends Error {
  public readonly code: BridgeErrorCodeType;
  public readonly detail?: string;

  constructor(code: BridgeErrorCodeType, message: string, detail?: string) {
    super(message);
    this.name = 'BridgeException';
    this.code = code;
    this.detail = detail;
  }

  public toBridgeError(): BridgeError {
    return { code: this.code, message: this.message, detail: this.detail };
  }
}

export const bridgeError = {
  unsupported: (action: string) =>
    new BridgeException(
      BridgeErrorCode.UNSUPPORTED_ACTION,
      `지원하지 않는 액션입니다: ${action}`,
    ),
  invalidPayload: (message: string) =>
    new BridgeException(BridgeErrorCode.INVALID_PAYLOAD, message),
  permissionDenied: (message: string) =>
    new BridgeException(BridgeErrorCode.PERMISSION_DENIED, message),
  userCancelled: (message = '사용자가 취소했습니다.') =>
    new BridgeException(BridgeErrorCode.USER_CANCELLED, message),
  notAvailable: (message: string) =>
    new BridgeException(BridgeErrorCode.NOT_AVAILABLE, message),
  internal: (message: string, detail?: string) =>
    new BridgeException(BridgeErrorCode.INTERNAL_ERROR, message, detail),
};

/** 임의의 throw 값을 웹에 보낼 BridgeError로 정규화합니다. */
export function toBridgeError(error: unknown): BridgeError {
  if (error instanceof BridgeException) {
    return error.toBridgeError();
  }
  const message = error instanceof Error ? error.message : String(error);
  return {
    code: BridgeErrorCode.INTERNAL_ERROR,
    message: message || '앱에서 처리 중 오류가 발생했습니다.',
    detail: error instanceof Error ? error.stack : undefined,
  };
}
