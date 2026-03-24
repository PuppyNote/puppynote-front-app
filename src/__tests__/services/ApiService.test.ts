import axios from 'axios';

describe('ApiService (API 통신 서비스 최종 검증)', () => {
  let mockRequestUse: jest.Mock;
  let mockResponseUse: jest.Mock;
  let mockAxiosInstance: any;
  let storageService: any;
  let apiService: any;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    mockRequestUse = jest.fn();
    mockResponseUse = jest.fn();

    const instance = jest.fn() as any;
    instance.interceptors = {
      request: { use: mockRequestUse, eject: jest.fn() },
      response: { use: mockResponseUse, eject: jest.fn() },
    };
    instance.get = jest.fn();
    instance.post = jest.fn();
    instance.put = jest.fn();
    instance.patch = jest.fn();
    instance.delete = jest.fn();
    mockAxiosInstance = instance;

    jest.doMock('axios', () => ({ create: jest.fn(() => mockAxiosInstance) }));
    jest.doMock('../../services/auth/StorageService', () => ({
      storageService: {
        getAccessToken: jest.fn(),
        getRefreshToken: jest.fn(),
        saveAccessToken: jest.fn(),
        saveRefreshToken: jest.fn(),
        clearTokens: jest.fn(),
        clearSelectedPet: jest.fn(),
      },
    }));

    const ApiModule = require('../../services/ApiService');
    apiService = ApiModule.apiService;
    const StorageModule = require('../../services/auth/StorageService');
    storageService = StorageModule.storageService;
  });

  it('요청 인터셉터: 토큰 주입 및 누락 케이스', async () => {
    const handler = mockRequestUse.mock.calls[0][0];
    
    // 토큰 있음
    storageService.getAccessToken.mockResolvedValue('token');
    const config1 = { headers: {} };
    await handler(config1);
    expect(config1.headers.Authorization).toBe('Bearer token');

    // 토큰 없음
    storageService.getAccessToken.mockResolvedValue(null);
    const config2 = { headers: {} };
    await handler(config2);
    expect(config2.headers.Authorization).toBeUndefined();
  });

  it('응답 인터셉터: 성공 응답 파싱 (52-57번 라인)', () => {
    const handler = mockResponseUse.mock.calls[0][0];
    const mockRes = { data: { statusCode: 200, data: 'payload' } };
    expect(handler(mockRes)).toEqual({ statusCode: 200, data: 'payload' });
  });

  it('응답 인터셉터: 401 및 토큰 갱신 성공 (68번 라인)', async () => {
    const errorHandler = mockResponseUse.mock.calls[0][1];
    const mockError = { response: { status: 401 }, config: { url: '/t', headers: {}, _retry: false } };
    storageService.getRefreshToken.mockResolvedValue('rt');
    mockAxiosInstance.post.mockResolvedValueOnce({ statusCode: 200, data: { accessToken: 'new' } });
    mockAxiosInstance.mockResolvedValueOnce({ data: 'retry' });
    
    const result = await errorHandler(mockError);
    expect(result).toEqual({ data: 'retry' });
  });

  it('응답 인터셉터: 서버 에러 로그 및 예외 분기 (102-110번 라인)', async () => {
    const errorHandler = mockResponseUse.mock.calls[0][1];
    const mockError = {
      response: { status: 500, data: { message: 'Internal Server Error' } },
      config: { url: '/api', method: 'GET' }
    };
    await expect(errorHandler(mockError)).rejects.toMatchObject({ statusCode: 500 });

    // message 없는 경우 fallback 메시지, statusCode 있는 경우 브랜치 커버리지
    const mockError2 = {
      response: { status: 400, data: { statusCode: 400 } },
      config: { url: '/api', method: 'POST' }
    };
    await expect(errorHandler(mockError2)).rejects.toMatchObject({ statusCode: 400 });
  });

  it('로그아웃 리스너 및 100% 호출 테스트 (128, 135번 라인)', async () => {
    const mockListener = jest.fn();
    apiService.setLogoutListener(mockListener);
    
    // 강제 로그아웃 호출 (내부 handleLogout 실행)
    const errorHandler = mockResponseUse.mock.calls[0][1];
    const mockError = { response: { status: 401 }, config: { url: '/t' } };
    storageService.getRefreshToken.mockResolvedValue(null);
    
    await expect(errorHandler(mockError)).rejects.toThrow();
    expect(mockListener).toHaveBeenCalled();
  });

  it('요청 인터셉터: 에러 핸들러 (36번 라인)', async () => {
    const errorHandler = mockRequestUse.mock.calls[0][1];
    const mockError = new Error('req error');
    await expect(errorHandler(mockError)).rejects.toThrow('req error');
  });

  it('응답 인터셉터: isRefreshing 큐 분기 (52-57번 라인)', async () => {
    const errorHandler = mockResponseUse.mock.calls[0][1];
    apiService['isRefreshing'] = true;

    const mockError = { response: { status: 401 }, config: { url: '/t', headers: {}, _retry: false } };
    const promise = errorHandler(mockError);

    mockAxiosInstance.mockResolvedValueOnce({ data: 'queued' });
    apiService['onTokenRefreshed']('newToken');

    const result = await promise;
    expect(result).toEqual({ data: 'queued' });
  });

  it('응답 인터셉터: isRefreshing 큐 분기 - headers 없는 경우 (54번 라인 false 브랜치)', async () => {
    const errorHandler = mockResponseUse.mock.calls[0][1];
    apiService['isRefreshing'] = true;

    const mockError = { response: { status: 401 }, config: { url: '/t', _retry: false } };
    const promise = errorHandler(mockError);

    mockAxiosInstance.mockResolvedValueOnce({ data: 'queued_no_headers' });
    apiService['onTokenRefreshed']('newToken');

    await promise;
  });

  it('응답 인터셉터: 401 refresh 성공 - headers 없는 경우 (85번 라인 false 브랜치)', async () => {
    const errorHandler = mockResponseUse.mock.calls[0][1];
    const mockError = { response: { status: 401 }, config: { url: '/t', _retry: false } };
    storageService.getRefreshToken.mockResolvedValue('rt');
    mockAxiosInstance.post.mockResolvedValueOnce({ statusCode: 200, data: { accessToken: 'new', refreshToken: 'newrt' } });
    mockAxiosInstance.mockResolvedValueOnce({ data: 'retry_no_headers' });

    await errorHandler(mockError);
  });

  it('응답 인터셉터: refresh statusCode !== 200 → Refresh failed (90번 라인)', async () => {
    const errorHandler = mockResponseUse.mock.calls[0][1];
    const mockError = { response: { status: 401 }, config: { url: '/t', headers: {}, _retry: false } };
    storageService.getRefreshToken.mockResolvedValue('rt');
    mockAxiosInstance.post.mockResolvedValueOnce({ statusCode: 400 });

    await expect(errorHandler(mockError)).rejects.toThrow('Refresh failed');
  });

  it('응답 인터셉터: 네트워크 에러 (response 없음) (116-117번 라인)', async () => {
    const errorHandler = mockResponseUse.mock.calls[0][1];
    const mockError = { message: '네트워크 연결 실패' };
    await expect(errorHandler(mockError)).rejects.toMatchObject({ message: '네트워크 연결을 확인해주세요.' });
  });

  it('HTTP 메서드 전체 커버리지 (144-156번 라인)', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: 'get' });
    mockAxiosInstance.post.mockResolvedValue({ data: 'post' });
    mockAxiosInstance.put.mockResolvedValue({ data: 'put' });
    mockAxiosInstance.patch.mockResolvedValue({ data: 'patch' });
    mockAxiosInstance.delete.mockResolvedValue({ data: 'delete' });

    await apiService.get('/u');
    await apiService.post('/u', {});
    await apiService.put('/u', {});
    await apiService.patch('/u', {});
    await apiService.delete('/u');

    expect(mockAxiosInstance.get).toHaveBeenCalled();
  });
});
