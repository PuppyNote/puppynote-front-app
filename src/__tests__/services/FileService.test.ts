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

  it('uploadImage 성공 시 키를 반환해야 한다', async () => {
    const mockKey = 'uploaded-key';
    (apiService.post as jest.Mock).mockResolvedValue({
      data: mockKey,
      statusCode: 200
    });

    const result = await fileService.uploadImage('PUPPY_PROFILE', 'uri', 'name', 'type');
    expect(result).toBe(mockKey);

    const config = (apiService.post as jest.Mock).mock.calls[0][2];
    const testData = {};
    expect(config.transformRequest(testData)).toBe(testData);
  });

  it('업로드 실패 시 서버 메시지와 함께 에러를 던져야 한다', async () => {
    // 1. 메시지가 있는 경우
    (apiService.post as jest.Mock).mockResolvedValue({
      statusCode: 400,
      message: '파일이 너무 큽니다.'
    });
    await expect(fileService.uploadImage('PUPPY_PROFILE', 'u', 'n', 't')).rejects.toThrow('파일이 너무 큽니다.');

    // 2. 메시지가 없는 경우 (기본 메시지)
    (apiService.post as jest.Mock).mockResolvedValue({
      statusCode: 500
    });
    await expect(fileService.uploadImage('PUPPY_PROFILE', 'u', 'n', 't')).rejects.toThrow('이미지 업로드에 실패했습니다.');
  });
});
