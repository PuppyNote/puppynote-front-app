import { homeService } from '../../services/home/HomeService';
import { apiService } from '../../services/ApiService';

// ApiService 모킹
jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
  },
}));

describe('HomeService (홈 서비스)', () => {
  const mockPetId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getHomeInfo는 홈 화면에 필요한 정보를 성공적으로 가져와야 한다', async () => {
    const mockData = {
      petName: '뽀삐',
      petProfileImageUrl: 'https://example.com/image.jpg',
      birthDate: '2020-01-01',
      registrationNumber: '12345',
      petAge: '4세',
      birthdayDday: 100,
      walkedToday: true,
      daysSinceLastWalk: 0,
      monthlyWalkMinutes: 300,
      recentWalkCount: 5,
      petItemCount: 3,
      todayWalkAlarmTimes: ['10:00', '18:00'],
    };

    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockData,
      statusCode: 200,
    });

    const result = await homeService.getHomeInfo(mockPetId);

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/home', {
      params: { petId: mockPetId }
    });
    expect(result).toEqual(mockData);
  });

  it('API 응답 코드가 200이 아닌 경우 에러를 던져야 한다', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({
      statusCode: 404,
      message: '정보를 찾을 수 없습니다.',
    });

    await expect(homeService.getHomeInfo(mockPetId)).rejects.toThrow('정보를 찾을 수 없습니다.');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 404 });
    await expect(homeService.getHomeInfo(mockPetId)).rejects.toThrow('홈 정보를 불러오는 데 실패했습니다.');
  });

  it('네트워크 통신 자체에 실패한 경우 에러를 던져야 한다', async () => {
    const mockError = new Error('네트워크 오류');
    (apiService.get as jest.Mock).mockRejectedValue(mockError);

    await expect(homeService.getHomeInfo(mockPetId)).rejects.toThrow('네트워크 오류');
  });
});
