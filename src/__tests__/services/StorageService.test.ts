import { storageService } from '../../services/auth/StorageService';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '../../services/ApiService';

// ApiService 모킹 (StorageService 내부의 uploadImage 테스트용)
jest.mock('../../services/ApiService', () => ({
  apiService: {
    post: jest.fn(),
  },
}));

describe('StorageService (저장소 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('토큰 및 펫 정보 관련 동작 성공', async () => {
    await storageService.saveAccessToken('at');
    await storageService.saveRefreshToken('rt');
    await storageService.saveSelectedPet(1, 'n');
    
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('at');
    expect(await storageService.getAccessToken()).toBe('at');
    
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('rt');
    expect(await storageService.getRefreshToken()).toBe('rt');

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('1').mockResolvedValueOnce('n');
    expect(await storageService.getSelectedPet()).toEqual({ id: 1, name: 'n' });
  });

  it('getSelectedPet 예외 분기 테스트', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    expect(await storageService.getSelectedPet()).toBeNull();
    
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('1').mockResolvedValueOnce(null);
    expect(await storageService.getSelectedPet()).toBeNull();
  });

  it('삭제 및 비우기 성공', async () => {
    await storageService.clearTokens();
    await storageService.clearSelectedPet();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
  });

  // StorageService.ts 에 아직 uploadImage 가 남아있는 경우를 대비한 테스트
  it('uploadImage (유산 코드) 테스트', async () => {
    // 만약 StorageService 에 uploadImage 가 있다면 호출됨
    if ((storageService as any).uploadImage) {
      (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 200, data: 'key' });
      const res = await (storageService as any).uploadImage('KIND', 'uri', 'name', 'type');
      expect(res).toBe('key');

      const config = (apiService.post as jest.Mock).mock.calls[0][2];
      const testData = {};
      expect(config.transformRequest(testData)).toBe(testData);

      (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400, message: 'fail' });
      await expect((storageService as any).uploadImage('KIND', 'uri', 'name', 'type')).rejects.toThrow('fail');

      (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400 });
      await expect((storageService as any).uploadImage('KIND', 'uri', 'name', 'type')).rejects.toThrow('이미지 업로드에 실패했습니다.');
    }
  });
});
