import { fileService } from '../../services/file/FileService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    post: jest.fn(),
  },
}));

// FormData 모킹
global.FormData = class {
  append = jest.fn();
} as any;

describe('FileService (파일 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploadImage는 이미지를 성공적으로 업로드하고 키를 반환해야 한다', async () => {
    const mockKey = 'uploaded-image-key';
    (apiService.post as jest.Mock).mockResolvedValue({
      data: mockKey,
      statusCode: 200
    });

    const result = await fileService.uploadImage(
      'PUPPY_PROFILE',
      'file://path/to/image.jpg',
      'image.jpg',
      'image/jpeg'
    );

    expect(apiService.post).toHaveBeenCalledWith(
      '/api/v1/storage/PUPPY_PROFILE',
      expect.any(Object),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );
    expect(result).toBe(mockKey);
  });

  it('업로드 실패 시 에러를 던져야 한다', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({
      statusCode: 400,
      message: '업로드 실패'
    });

    await expect(fileService.uploadImage(
      'PUPPY_PROFILE',
      'file://path/to/image.jpg',
      'image.jpg',
      'image/jpeg'
    )).rejects.toThrow('업로드 실패');
  });
});
