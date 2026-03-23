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

  it('getAlertSetting은 알림 설정을 성공적으로 조회해야 한다', async () => {
    const mockData = { all: 'ON', walk: 'ON', friend: 'OFF' };
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockData,
      statusCode: 200
    });

    const result = await alertSettingService.getAlertSetting();

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/alert-setting');
    expect(result).toEqual(mockData);
  });

  it('updateAlertSetting은 알림 설정을 성공적으로 수정해야 한다', async () => {
    const updateData = { all: 'OFF', walk: 'OFF', friend: 'OFF' };
    (apiService.patch as jest.Mock).mockResolvedValue({
      data: updateData,
      statusCode: 200
    });

    const result = await alertSettingService.updateAlertSetting(updateData as any);

    expect(apiService.patch).toHaveBeenCalledWith('/api/v1/alert-setting', updateData);
    expect(result).toEqual(updateData);
  });
});
