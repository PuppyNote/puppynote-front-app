import { apiService } from '../ApiService';
import { FoodItem, FoodSearchResponse, FoodSearchRequest, FoodAiRequest } from '../../types/Food';

class FoodService {
  /**
   * 음식 조회 (ES 검색)
   */
  async searchFoods(params: FoodSearchRequest): Promise<FoodSearchResponse> {
    const { question, page = 0, size = 10 } = params;
    let url = `/api/v1/foods?page=${page}&size=${size}`;
    if (question) {
      url += `&question=${encodeURIComponent(question)}`;
    }
    const response = await apiService.get<FoodSearchResponse>(url);
    return response.data;
  }

  /**
   * 음식 AI 조회
   */
  async searchFoodAi(data: FoodAiRequest): Promise<FoodItem> {
    const response = await apiService.post<FoodItem>('/api/v1/foods/ai', data);
    return response.data;
  }
}

export const foodService = new FoodService();
