import { petService } from '../../services/pet/PetService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('PetService (반려동물 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getPets 성공 및 실패', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: [], statusCode: 200 });
    await petService.getPets();

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(petService.getPets()).rejects.toThrow('에러');

    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(petService.getPets()).rejects.toThrow('펫 목록 조회에 실패했습니다.');
  });

  it('registerPet 성공 및 실패', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({ data: {}, statusCode: 201 });
    await petService.registerPet({} as any);

    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400, message: '에러' });
    await expect(petService.registerPet({} as any)).rejects.toThrow('에러');

    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400 });
    await expect(petService.registerPet({} as any)).rejects.toThrow('펫 등록에 실패했습니다.');
  });

  it('updatePet 성공 및 실패', async () => {
    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await petService.updatePet(1, {} as any);

    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(petService.updatePet(1, {} as any)).rejects.toThrow('에러');

    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(petService.updatePet(1, {} as any)).rejects.toThrow('펫 프로필 수정에 실패했습니다.');
  });

  it('deletePet 성공 및 실패', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await petService.deletePet(1);

    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 500, message: '에러' });
    await expect(petService.deletePet(1)).rejects.toThrow('에러');

    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 500 });
    await expect(petService.deletePet(1)).rejects.toThrow('펫 삭제에 실패했습니다.');
  });
});
