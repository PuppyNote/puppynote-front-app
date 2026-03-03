import { apiService } from '../ApiService';

export interface PetTip {
  id: number;
  content: string;
}

class PetTipService {
  /**
   * 랜덤 반려견 팁 조회 API
   */
  public async getRandomPetTip(): Promise<PetTip> {
    const response = await apiService.get<PetTip>('/api/v1/pet-tips/random');
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '팁을 불러오는 데 실패했습니다.');
    }
    
    return response.data;
  }
}

export const petTipService = new PetTipService();
