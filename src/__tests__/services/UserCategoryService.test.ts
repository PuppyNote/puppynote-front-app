import { userCategoryService } from '../../services/userCategory/UserCategoryService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('UserCategoryService (사용자 카테고리 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUserCategories 성공 및 실패 (ITEM & ACTIVITY)', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await userCategoryService.getUserCategories('ITEM');
    await userCategoryService.getUserCategories('ACTIVITY');
    
    (apiService.get as jest.Mock).mockRejectedValue(new Error('에러'));
    await expect(userCategoryService.getUserCategories('ITEM')).rejects.toThrow('에러');
  });

  it('saveUserCategories 성공 및 실패', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await userCategoryService.saveUserCategories('ITEM', ['a']);
    
    (apiService.post as jest.Mock).mockRejectedValue(new Error('에러'));
    await expect(userCategoryService.saveUserCategories('ACTIVITY', ['b'])).rejects.toThrow('에러');
  });
});
