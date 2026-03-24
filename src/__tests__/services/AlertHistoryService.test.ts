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

  it('getAlertHistories 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    await alertHistoryService.getAlertHistories();

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(alertHistoryService.getAlertHistories()).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(alertHistoryService.getAlertHistories()).rejects.toThrow('알림 내역 조회에 실패했습니다.');
  });

  it('getUncheckedAlertExists 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: true, statusCode: 200 });
    const res = await alertHistoryService.getUncheckedAlertExists();
    expect(res).toBe(true);

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 400, message: '에러' });
    await expect(alertHistoryService.getUncheckedAlertExists()).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 400 });
    await expect(alertHistoryService.getUncheckedAlertExists()).rejects.toThrow('알림 존재 여부 조회에 실패했습니다.');
  });

  it('checkAlert 성공 및 실패', async () => {
    (apiService.patch as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    await alertHistoryService.checkAlert(1);

    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 404, message: '에러' });
    await expect(alertHistoryService.checkAlert(1)).rejects.toThrow('에러');

    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 404 });
    await expect(alertHistoryService.checkAlert(1)).rejects.toThrow('알림 확인 처리에 실패했습니다.');
  });
});
