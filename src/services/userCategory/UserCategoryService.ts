import { apiService } from '../ApiService';
import { UserCategoryResponse } from '../../types/PetItem';

class UserCategoryService {
  public async getUserCategories(categoryType: 'ITEM' | 'ACTIVITY'): Promise<UserCategoryResponse[]> {
    try {
      const response = await apiService.get<UserCategoryResponse[]>('/api/v1/user-item-categories', {
        params: { categoryType }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${categoryType} categories:`, error);
      throw error;
    }
  }

  public async saveUserCategories(categoryType: 'ITEM' | 'ACTIVITY', categories: string[]): Promise<void> {
    try {
      await apiService.post('/api/v1/user-item-categories', {
        categoryType,
        categories
      });
    } catch (error) {
      console.error(`Failed to save ${categoryType} categories:`, error);
      throw error;
    }
  }
}

export const userCategoryService = new UserCategoryService();
