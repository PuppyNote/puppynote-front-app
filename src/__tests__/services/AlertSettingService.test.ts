import { alertSettingService } from '../../services/alertSetting/AlertSettingService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('AlertSettingService (알림 설정 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAlertSetting 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    await alertSettingService.getAlertSetting();

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(alertSettingService.getAlertSetting()).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(alertSettingService.getAlertSetting()).rejects.toThrow('알림 설정 조회에 실패했습니다.');
  });

  it('updateAlertSetting 성공 및 실패', async () => {
    (apiService.patch as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    await alertSettingService.updateAlertSetting({} as any);

    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 400, message: '에러' });
    await expect(alertSettingService.updateAlertSetting({} as any)).rejects.toThrow('에러');

    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 400 });
    await expect(alertSettingService.updateAlertSetting({} as any)).rejects.toThrow('알림 설정 수정에 실패했습니다.');
  });
});
