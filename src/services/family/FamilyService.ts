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
  public async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const response = await apiService.get<FamilyMember[]>('/api/v1/family-members');
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
  public async inviteFamilyMember(inviteeUserId: number): Promise<void> {
    try {
      await apiService.post('/api/v1/family-members/invite', { inviteeUserId });
    } catch (error) {
      console.error('Failed to invite family member:', error);
      throw error;
    }
  }

  /**
   * 가족 등록 (초대 수락) API
   */
  public async registerFamily(inviterUserId: number): Promise<void> {
    try {
      await apiService.post('/api/v1/family-members/register', { inviterUserId });
    } catch (error) {
      console.error('Failed to register family:', error);
      throw error;
    }
  }
}

export const familyService = new FamilyService();
