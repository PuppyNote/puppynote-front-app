import { storageService } from '../../services/auth/StorageService';
import * as SecureStore from 'expo-secure-store';

describe('StorageService (저장소 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saveAccessToken은 토큰을 SecureStore에 저장해야 한다', async () => {
    const token = 'test-token';
    await storageService.saveAccessToken(token);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', token);
  });

  it('getAccessToken은 SecureStore에서 토큰을 가져와야 한다', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token');
    const token = await storageService.getAccessToken();
    expect(token).toBe('test-token');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('accessToken');
  });

  it('saveSelectedPet은 펫 정보를 SecureStore에 저장해야 한다', async () => {
    await storageService.saveSelectedPet(1, '뽀삐');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('selectedPetId', '1');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('selectedPetName', '뽀삐');
  });

  it('getSelectedPet은 저장된 펫 정보를 객체 형태로 반환해야 한다', async () => {
    (SecureStore.getItemAsync as jest.Mock)
      .mockResolvedValueOnce('1')    // id
      .mockResolvedValueOnce('뽀삐'); // name

    const pet = await storageService.getSelectedPet();
    expect(pet).toEqual({ id: 1, name: '뽀삐' });
  });

  it('clearTokens는 모든 토큰을 삭제해야 한다', async () => {
    await storageService.clearTokens();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
  });
});
