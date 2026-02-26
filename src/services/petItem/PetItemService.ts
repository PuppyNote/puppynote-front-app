import { apiService } from '../ApiService';
import { MajorCategory } from '../../types/PetItem';

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
}

export const petItemService = new PetItemService();
