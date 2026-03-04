import { apiService } from '../ApiService';

export interface PetSummary {
  petId: number;
  petName: string;
  petProfileUrl: string;
}

export interface PetDetail {
  petId: number;
  petName: string;
}

export interface RegisterPetRequest {
  name: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  profileImageUrl?: string;
}

class PetService {
  // 펫 목록 조회 API
  public async getPets(): Promise<PetSummary[]> {
    const response = await apiService.get<PetSummary[]>('/api/v1/pets');
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '펫 목록 조회에 실패했습니다.');
    }
    
    return response.data;
  }

  // 펫 등록 API
  public async registerPet(data: RegisterPetRequest): Promise<PetDetail> {
    const response = await apiService.post<PetDetail>('/api/v1/pets', data);
    
    if (response.statusCode !== 201) {
      throw new Error(response.message || '펫 등록에 실패했습니다.');
    }
    
    return response.data;
  }

  /**
   * 펫 프로필 수정 API
   */
  public async updatePet(petId: number, data: {
    name: string;
    birthDate?: string | null;
    profileImage?: string | null;
  }): Promise<void> {
    const response = await apiService.patch(`/api/v1/pets/${petId}`, data);
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '펫 프로필 수정에 실패했습니다.');
    }
  }
}

export const petService = new PetService();
