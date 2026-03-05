import { apiService } from '../ApiService';
import { MajorCategory, PetItem } from '../../types/PetItem';

export interface PurchaseHistory {
  id: number;
  petItemId: number;
  purchasedAt: string;
}

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

  public async getPetItemDetail(petItemId: number): Promise<PetItem> {
    try {
      const response = await apiService.get<PetItem>(`/api/v1/pet-items/${petItemId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pet item detail:', error);
      throw error;
    }
  }

  /**
   * 용품 수정 API
   */
  public async updatePetItem(petItemId: number, data: {
    name: string;
    category: string;
    purchaseCycleDays: number;
    purchaseUrl?: string;
    imageKey?: string;
  }): Promise<PetItem> {
    try {
      const response = await apiService.patch<PetItem>(`/api/v1/pet-items/${petItemId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update pet item:', error);
      throw error;
    }
  }

  /**
   * 용품 삭제 API
   */
  public async deletePetItem(petItemId: number): Promise<void> {
    try {
      await apiService.delete(`/api/v1/pet-items/${petItemId}`);
    } catch (error) {
      console.error('Failed to delete pet item:', error);
      throw error;
    }
  }

  /**
   * 용품 구매 이력 조회 API
   */
  public async getPurchaseHistory(petItemId: number): Promise<PurchaseHistory[]> {
    try {
      const response = await apiService.get<PurchaseHistory[]>(`/api/v1/pet-items/${petItemId}/purchases`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
      throw error;
    }
  }

  /**
   * 용품 구매 이력 등록 API
   */
  public async createPurchase(petItemId: number, purchasedAt?: string): Promise<PurchaseHistory> {
    try {
      const response = await apiService.post<PurchaseHistory>(`/api/v1/pet-items/${petItemId}/purchases`, {
        purchasedAt: purchasedAt || null
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create purchase history:', error);
      throw error;
    }
  }
}

export const petItemService = new PetItemService();
