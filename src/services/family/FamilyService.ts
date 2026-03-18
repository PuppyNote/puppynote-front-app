import { apiService } from '../ApiService';

export interface FamilyMember {
  userId: number;
  nickName: string;
  profileUrl: string | null;
  role: 'OWNER' | 'FAMILY';
  status: 'DONE' | 'PENDING';
}

export interface SearchedUser {
  userId: number;
  email: string;
  nickName: string;
  profileUrl: string | null;
}

class FamilyService {
  /**
   * 가족 목록 조회 API
   */
  public async getFamilyMembers(petId: number): Promise<FamilyMember[]> {
    try {
      const response = await apiService.get<FamilyMember[]>('/api/v1/family-members', {
        params: { petId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch family members:', error);
      throw error;
    }
  }

  /**
   * 유저 검색 (이메일 LIKE) API
   */
  public async searchUsers(email: string): Promise<SearchedUser[]> {
    try {
      const response = await apiService.get<SearchedUser[]>('/api/v1/family-members/search', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }

  /**
   * 가족 초대 API
   */
  public async inviteFamilyMember(inviteeUserId: number, petId: number): Promise<void> {
    try {
      await apiService.post('/api/v1/family-members/invite', { 
        inviteeUserId,
        petId
      });
    } catch (error) {
      console.error('Failed to invite family member:', error);
      throw error;
    }
  }

  /**
   * 가족 등록 (초대 수락) API
   */
  public async registerFamily(userId: number, petId: number): Promise<void> {
    try {
      await apiService.post('/api/v1/family-members/register', { 
        userId,
        petId
      });
    } catch (error) {
      console.error('Failed to register family:', error);
      throw error;
    }
  }

  /**
   * 가족 삭제 API
   */
  public async deleteFamilyMember(targetUserId: number, petId: number): Promise<void> {
    try {
      await apiService.delete(`/api/v1/family-members/${targetUserId}`, {
        params: { petId }
      });
    } catch (error) {
      console.error('Failed to delete family member:', error);
      throw error;
    }
  }
}

export const familyService = new FamilyService();
