import { apiService } from '../ApiService';
import { MajorCategory, PetItem } from '../../types/PetItem';

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

  public async getPetItems(petId: number, category?: string): Promise<PetItem[]> {
    try {
      const params: any = { petId };
      if (category && category !== 'all') {
        params.category = category;
      }
      const response = await apiService.get<PetItem[]>('/api/v1/pet-items', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pet items:', error);
      throw error;
    }
  }

  public async createPetItem(data: {
    petId: number;
    name: string;
    category: string;
    purchaseCycleDays: number;
    purchaseUrl?: string;
    imageKey?: string;
  }): Promise<PetItem> {
    try {
      const response = await apiService.post<PetItem>('/api/v1/pet-items', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create pet item:', error);
      throw error;
    }
  }
}

export const petItemService = new PetItemService();
