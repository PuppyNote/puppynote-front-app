import { alertHistoryService } from '../../services/alertHistory/AlertHistoryService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('AlertHistoryService (알림 이력 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAlertHistories는 알림 이력 목록을 성공적으로 조회해야 한다', async () => {
    const mockResponse = {
      content: [{ id: 1, alertDescription: '메시지' }],
      pageInfo: { currentPage: 1, totalPage: 1, totalElement: 1 }
    };
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockResponse,
      statusCode: 200
    });

    const result = await alertHistoryService.getAlertHistories(1, 12);

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/alertHistories', {
      params: { page: 1, size: 12 }
    });
    expect(result).toEqual(mockResponse);
  });

  it('checkAlert는 알림 확인 처리를 성공적으로 수행해야 한다', async () => {
    const mockResponse = { alertHistoryStatus: 'CHECKED' };
    (apiService.patch as jest.Mock).mockResolvedValue({
      data: mockResponse,
      statusCode: 200
    });

    const result = await alertHistoryService.checkAlert(100);

    expect(apiService.patch).toHaveBeenCalledWith('/api/v1/alertHistories/100');
    expect(result).toEqual(mockResponse);
  });
});
