import { apiService, ApiResponse } from '../ApiService';
import { MajorCategory, UserCategoryResponse } from '../../types/PetItem';

class PetItemService {
  public async getCategories(): Promise<MajorCategory[]> {
    try {
      const response = await apiService.get<MajorCategory[]>('/api/v1/pet-items/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pet item categories:', error);
      throw error;
    }
  }

  public async getUserCategories(): Promise<UserCategoryResponse[]> {
    try {
      const response = await apiService.get<UserCategoryResponse[]>('/api/v1/user-item-categories', {
        params: { categoryType: 'ITEM' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user item categories:', error);
      throw error;
    }
  }

  public async saveUserCategories(categories: string[]): Promise<void> {
    try {
      await apiService.post('/api/v1/user-item-categories', {
        categoryType: 'ITEM',
        categories: categories
      });
    } catch (error) {
      console.error('Failed to save user categories:', error);
      throw error;
    }
  }
}

export const petItemService = new PetItemService();
