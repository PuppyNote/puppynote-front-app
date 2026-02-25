import { apiService } from '../ApiService';

export interface CreateWalkRequest {
  petId: number;
  startTime: string; // ISO format
  endTime: string;   // ISO format
  latitude: number;
  longitude: number;
  location: string;
  memo: string;
  photoKeys: string[];
}

export interface WalkHistory {
  id: number;
  petId: number;
  startTime: string;
  endTime: string;
  location: string;
  memo: string;
  photoUrls: string[];
}

class WalkService {
  // 산책 이력 저장 API
  public async saveWalk(data: CreateWalkRequest): Promise<void> {
    const response = await apiService.post<void>('/api/v1/walks', data);
    
    if (response.statusCode !== 201 && response.statusCode !== 200) {
      throw new Error(response.message || '산책 기록 저장에 실패했습니다.');
    }
  }
}

export const walkService = new WalkService();
