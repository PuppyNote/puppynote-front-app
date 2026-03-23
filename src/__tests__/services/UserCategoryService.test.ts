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

  it('getUserCategories는 아이템 카테고리 목록을 성공적으로 조회해야 한다', async () => {
    const mockCategories = [{ categoryId: 1, categoryName: '사료' }];
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockCategories,
      statusCode: 200
    });

    const result = await userCategoryService.getUserCategories('ITEM');

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/user-item-categories', {
      params: { categoryType: 'ITEM' }
    });
    expect(result).toEqual(mockCategories);
  });

  it('saveUserCategories는 카테고리 목록을 성공적으로 저장해야 한다', async () => {
    const categories = ['사료', '간식'];
    (apiService.post as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await userCategoryService.saveUserCategories('ITEM', categories);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/user-item-categories', {
      categoryType: 'ITEM',
      categories
    });
  });
});
