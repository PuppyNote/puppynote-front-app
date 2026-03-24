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

  it('모든 메서드 성공 케이스 테스트', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    (apiService.post as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    (apiService.patch as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 200 });

    await petItemService.getCategories();
    await petItemService.getPetItems(1);
    await petItemService.getPetItems(1, 'food');
    await petItemService.getPetItems(1, 'all');
    await petItemService.createPetItem({} as any);
    await petItemService.getPetItemDetail(1);
    await petItemService.updatePetItem(1, {} as any);
    await petItemService.deletePetItem(1);
    await petItemService.getPurchaseHistory(1);
    await petItemService.createPurchase(1);
    await petItemService.deletePurchase(1);

    expect(apiService.get).toHaveBeenCalled();
  });

  it('모든 메서드 실패(catch 블록) 커버리지 테스트', async () => {
    const error = new Error('API 에러');
    (apiService.get as jest.Mock).mockRejectedValue(error);
    (apiService.post as jest.Mock).mockRejectedValue(error);
    (apiService.patch as jest.Mock).mockRejectedValue(error);
    (apiService.delete as jest.Mock).mockRejectedValue(error);

    await expect(petItemService.getCategories()).rejects.toThrow('API 에러');
    await expect(petItemService.getPetItems(1)).rejects.toThrow('API 에러');
    await expect(petItemService.createPetItem({} as any)).rejects.toThrow('API 에러');
    await expect(petItemService.getPetItemDetail(1)).rejects.toThrow('API 에러');
    await expect(petItemService.updatePetItem(1, {} as any)).rejects.toThrow('API 에러');
    await expect(petItemService.deletePetItem(1)).rejects.toThrow('API 에러');
    await expect(petItemService.getPurchaseHistory(1)).rejects.toThrow('API 에러');
    await expect(petItemService.createPurchase(1)).rejects.toThrow('API 에러');
    await expect(petItemService.deletePurchase(1)).rejects.toThrow('API 에러');
  });
});
