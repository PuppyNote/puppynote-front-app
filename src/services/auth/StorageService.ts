import * as SecureStore from 'expo-secure-store';
import { apiService } from '../ApiService';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const SELECTED_PET_ID_KEY = 'selectedPetId';
const SELECTED_PET_NAME_KEY = 'selectedPetName';

class StorageService {
  public async saveAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }

  public async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }

  public async saveRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }

  public async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  public async saveSelectedPet(petId: number, petName: string): Promise<void> {
    await SecureStore.setItemAsync(SELECTED_PET_ID_KEY, petId.toString());
    await SecureStore.setItemAsync(SELECTED_PET_NAME_KEY, petName);
  }

  public async getSelectedPet(): Promise<{ id: number; name: string } | null> {
    const id = await SecureStore.getItemAsync(SELECTED_PET_ID_KEY);
    const name = await SecureStore.getItemAsync(SELECTED_PET_NAME_KEY);
    if (id && name) {
      return { id: parseInt(id, 10), name };
    }
    return null;
  }

  public async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }

  public async clearSelectedPet(): Promise<void> {
    await SecureStore.deleteItemAsync(SELECTED_PET_ID_KEY);
    await SecureStore.deleteItemAsync(SELECTED_PET_NAME_KEY);
  }

  // 이미지 업로드 API
  public async uploadImage(bucketKind: string, uri: string, filename: string, type: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);

    const response = await apiService.post<string>(`/api/v1/storage/${bucketKind}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data) => data, // Prevent Axios from transforming FormData
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '이미지 업로드에 실패했습니다.');
    }
    
    return response.data;
  }
}

export const storageService = new StorageService();
