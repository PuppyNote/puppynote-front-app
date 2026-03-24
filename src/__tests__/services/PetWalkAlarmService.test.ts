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

  it('getWalkAlarms 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await petWalkAlarmService.getWalkAlarms(1);
    
    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(petWalkAlarmService.getWalkAlarms(1)).rejects.toThrow();
  });

  it('createWalkAlarm 성공 및 실패', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({ data: {}, statusCode: 201 });
    await petWalkAlarmService.createWalkAlarm({} as any);
    
    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400 });
    await expect(petWalkAlarmService.createWalkAlarm({} as any)).rejects.toThrow();
  });

  it('updateWalkAlarm 성공 및 실패', async () => {
    (apiService.put as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    await petWalkAlarmService.updateWalkAlarm({} as any);
    
    (apiService.put as jest.Mock).mockResolvedValue({ statusCode: 400 });
    await expect(petWalkAlarmService.updateWalkAlarm({} as any)).rejects.toThrow();
  });

  it('updateWalkAlarmStatus 성공 및 실패', async () => {
    (apiService.patch as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    await petWalkAlarmService.updateWalkAlarmStatus(1, 'ON');
    
    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 400 });
    await expect(petWalkAlarmService.updateWalkAlarmStatus(1, 'ON')).rejects.toThrow();
  });

  it('deleteWalkAlarm 성공 및 실패', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await petWalkAlarmService.deleteWalkAlarm(1);
    
    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 204 });
    await petWalkAlarmService.deleteWalkAlarm(1);

    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(petWalkAlarmService.deleteWalkAlarm(1)).rejects.toThrow();
  });
});
