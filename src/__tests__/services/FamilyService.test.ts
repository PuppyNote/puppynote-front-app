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

  it('getFamilyMembers 호출 성공', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await familyService.getFamilyMembers(1);
    expect(apiService.get).toHaveBeenCalled();
  });

  it('searchUsers 호출 성공', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await familyService.searchUsers('e');
    expect(apiService.get).toHaveBeenCalled();
  });

  it('inviteFamilyMember 호출 성공', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await familyService.inviteFamilyMember(1, 1);
    expect(apiService.post).toHaveBeenCalled();
  });

  it('registerFamily 호출 성공', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await familyService.registerFamily(1, 1);
    expect(apiService.post).toHaveBeenCalled();
  });

  it('deleteFamilyMember 호출 성공', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await familyService.deleteFamilyMember(1, 1);
    expect(apiService.delete).toHaveBeenCalled();
  });

  // 에러 케이스 (catch 블록 커버리지)
  it('API 호출 실패 시 에러를 던져야 한다', async () => {
    (apiService.get as jest.Mock).mockRejectedValue(new Error('네트워크에러'));
    await expect(familyService.getFamilyMembers(1)).rejects.toThrow('네트워크에러');
    await expect(familyService.searchUsers('e')).rejects.toThrow('네트워크에러');
    
    (apiService.post as jest.Mock).mockRejectedValue(new Error('서버에러'));
    await expect(familyService.inviteFamilyMember(1, 1)).rejects.toThrow('서버에러');
    await expect(familyService.registerFamily(1, 1)).rejects.toThrow('서버에러');

    (apiService.delete as jest.Mock).mockRejectedValue(new Error('삭제에러'));
    await expect(familyService.deleteFamilyMember(1, 1)).rejects.toThrow('삭제에러');
  });
});
