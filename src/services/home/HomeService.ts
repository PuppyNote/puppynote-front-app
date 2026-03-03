import { apiService } from '../ApiService';

export interface HomeInfo {
  petName: string;
  petProfileImageUrl: string | null;
  recentWalkCount: number;
  petItemCount: number;
}

class HomeService {
  /**
   * 메인화면 기본정보 조회 API
   */
  public async getHomeInfo(petId: number): Promise<HomeInfo> {
    const response = await apiService.get<HomeInfo>('/api/v1/home', {
      params: { petId }
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '홈 정보를 불러오는 데 실패했습니다.');
    }
    
    return response.data;
  }
}

export const homeService = new HomeService();
