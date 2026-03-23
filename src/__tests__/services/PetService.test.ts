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

  it('getPets는 반려동물 목록을 성공적으로 조회해야 한다', async () => {
    const mockPets = [{ petId: 1, petName: '뽀삐' }];
    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockPets,
      statusCode: 200
    });

    const result = await petService.getPets();

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/pets');
    expect(result).toEqual(mockPets);
  });

  it('registerPet은 새 반려동물을 성공적으로 등록해야 한다', async () => {
    const petData = { name: '초코', birthDate: '2021-05-05' };
    const mockResponse = { petId: 2, petName: '초코' };
    
    (apiService.post as jest.Mock).mockResolvedValue({
      data: mockResponse,
      statusCode: 201
    });

    const result = await petService.registerPet(petData);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/pets', petData);
    expect(result).toEqual(mockResponse);
  });

  it('updatePet은 반려동물 정보를 성공적으로 수정해야 한다', async () => {
    const updateData = { name: '초코초코' };
    (apiService.patch as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await petService.updatePet(1, updateData);

    expect(apiService.patch).toHaveBeenCalledWith('/api/v1/pets/1', updateData);
  });

  it('deletePet은 반려동물 정보를 성공적으로 삭제해야 한다', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await petService.deletePet(1);

    expect(apiService.delete).toHaveBeenCalledWith('/api/v1/pets/1');
  });
});
