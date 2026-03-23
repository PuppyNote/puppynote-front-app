import { petTipService } from '../../services/petTip/PetTipService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
  },
}));

describe('PetTipService (반려동물 팁 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getRandomPetTip은 랜덤 반려견 팁을 성공적으로 가져와야 한다', async () => {
    const mockTip = { id: 1, content: '강아지는 산책을 좋아합니다.' };
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockTip,
      statusCode: 200
    });

    const result = await petTipService.getRandomPetTip();

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/pet-tips/random');
    expect(result).toEqual(mockTip);
  });

  it('응답 상태 코드가 200이 아닐 경우 에러를 던져야 한다', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({
      statusCode: 500,
      message: '서버 오류'
    });

    await expect(petTipService.getRandomPetTip()).rejects.toThrow('서버 오류');
  });
});
