import { familyService } from '../../services/family/FamilyService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('FamilyService (가족 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getFamilyMembers는 가족 구성원 목록을 성공적으로 조회해야 한다', async () => {
    const mockMembers = [
      { userId: 1, nickName: '주인', role: 'OWNER', status: 'DONE' }
    ];
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockMembers,
      statusCode: 200
    });

    const result = await familyService.getFamilyMembers(1);

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/family-members', {
      params: { petId: 1 }
    });
    expect(result).toEqual(mockMembers);
  });

  it('searchUsers는 이메일로 사용자를 성공적으로 검색해야 한다', async () => {
    const mockUsers = [
      { userId: 2, email: 'test@test.com', nickName: '친구' }
    ];
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockUsers,
      statusCode: 200
    });

    const result = await familyService.searchUsers('test@test.com');

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/family-members/search', {
      params: { email: 'test@test.com' }
    });
    expect(result).toEqual(mockUsers);
  });

  it('inviteFamilyMember는 가족 초대를 성공적으로 보내야 한다', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await familyService.inviteFamilyMember(2, 1);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/family-members/invite', {
      inviteeUserId: 2,
      petId: 1
    });
  });

  it('deleteFamilyMember는 가족 구성원을 성공적으로 삭제해야 한다', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await familyService.deleteFamilyMember(2, 1);

    expect(apiService.delete).toHaveBeenCalledWith('/api/v1/family-members/2', {
      params: { petId: 1 }
    });
  });
});
