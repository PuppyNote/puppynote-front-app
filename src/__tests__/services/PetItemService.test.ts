import { petItemService } from '../../services/petItem/PetItemService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('PetItemService (용품 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getPetItems는 용품 목록을 성공적으로 조회해야 한다', async () => {
    const mockItems = [{ petItemId: 1, name: '사료' }];
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockItems,
      statusCode: 200
    });

    const result = await petItemService.getPetItems(1);

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/pet-items', {
      params: { petId: 1 }
    });
    expect(result).toEqual(mockItems);
  });

  it('createPetItem은 새 용품을 성공적으로 등록해야 한다', async () => {
    const itemData = { petId: 1, name: '간식', category: 'SNACK', purchaseCycleDays: 30 };
    (apiService.post as jest.Mock).mockResolvedValue({
      data: { ...itemData, petItemId: 2 },
      statusCode: 200
    });

    const result = await petItemService.createPetItem(itemData);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/pet-items', itemData);
    expect(result.petItemId).toBe(2);
  });

  it('deletePetItem은 용품을 성공적으로 삭제해야 한다', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await petItemService.deletePetItem(100);

    expect(apiService.delete).toHaveBeenCalledWith('/api/v1/pet-items/100');
  });
});
