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
  walkId: number;
  petId: number;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  location: string;
  memo: string;
  photoUrl: string;
}

export interface CalendarDayStatus {
  date: string;
  hasWalk: boolean;
}

class WalkService {
  // 산책 이력 목록 조회 API
  public async getWalkHistory(petId: number, date: string): Promise<WalkHistory[]> {
    const response = await apiService.get<WalkHistory[]>('/api/v1/walks', {
      params: { petId, date }
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '산책 이력 조회에 실패했습니다.');
    }
    
    return response.data;
  }

  // 산책 캘린더 조회 API
  public async getWalkCalendar(petId: number, yearMonth: string): Promise<CalendarDayStatus[]> {
    const response = await apiService.get<CalendarDayStatus[]>('/api/v1/walks/calendar', {
      params: { petId, yearMonth }
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '캘린더 조회에 실패했습니다.');
    }
    
    return response.data;
  }

  // 산책 이력 저장 API
  public async saveWalk(data: CreateWalkRequest): Promise<void> {
    const response = await apiService.post<void>('/api/v1/walks', data);
    
    if (response.statusCode !== 201 && response.statusCode !== 200) {
      throw new Error(response.message || '산책 기록 저장에 실패했습니다.');
    }
  }
}

export const walkService = new WalkService();
