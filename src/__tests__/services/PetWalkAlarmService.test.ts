import { petWalkAlarmService } from '../../services/petWalkAlarm/PetWalkAlarmService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('PetWalkAlarmService (산책 알람 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getWalkAlarms는 알람 목록을 성공적으로 가져와야 한다', async () => {
    const mockAlarms = [{ alarmId: 1, alarmTime: '10:00', alarmStatus: 'ON' }];
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockAlarms,
      statusCode: 200
    });

    const result = await petWalkAlarmService.getWalkAlarms(1);

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/pet-walk-alarms', {
      params: { petId: 1 }
    });
    expect(result).toEqual(mockAlarms);
  });

  it('createWalkAlarm은 새로운 알람을 성공적으로 등록해야 한다', async () => {
    const request = { petId: 1, alarmTime: '08:00', alarmStatus: 'ON', alarmDays: ['MON'] };
    (apiService.post as jest.Mock).mockResolvedValue({
      data: { ...request, alarmId: 2 },
      statusCode: 201
    });

    const result = await petWalkAlarmService.createWalkAlarm(request as any);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/pet-walk-alarms', request);
    expect(result.alarmId).toBe(2);
  });

  it('updateWalkAlarmStatus는 알람 상태를 성공적으로 변경해야 한다', async () => {
    const mockResponse = { alarmId: 1, alarmStatus: 'OFF' };
    (apiService.patch as jest.Mock).mockResolvedValue({
      data: mockResponse,
      statusCode: 200
    });

    const result = await petWalkAlarmService.updateWalkAlarmStatus(1, 'OFF' as any);

    expect(apiService.patch).toHaveBeenCalledWith('/api/v1/pet-walk-alarms/status', {
      alarmId: 1,
      alarmStatus: 'OFF',
    });
    expect(result).toEqual(mockResponse);
  });

  it('deleteWalkAlarm은 알람을 성공적으로 삭제해야 한다', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await petWalkAlarmService.deleteWalkAlarm(1);

    expect(apiService.delete).toHaveBeenCalledWith('/api/v1/pet-walk-alarms/1');
  });
});
