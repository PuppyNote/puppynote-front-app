import { communityService } from '../../services/community/CommunityService';
import { apiService } from '../../services/ApiService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('CommunityService (커뮤니티 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getPosts는 게시물 목록을 성공적으로 조회해야 한다', async () => {
    const mockResponse = {
      posts: [{ postId: 1, content: '내용' }],
      currentPage: 0,
      totalPages: 1,
      totalCount: 1
    };

    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockResponse,
      statusCode: 200
    });

    const result = await communityService.getPosts(0, 20, '강아지');

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/community/posts', {
      params: { page: 0, size: 20, keyword: '강아지' }
    });
    expect(result.data).toEqual(mockResponse);
  });

  it('createPost는 새 게시물을 성공적으로 등록해야 한다', async () => {
    const request = { content: '새 게시물', hashtags: ['펫'] };
    (apiService.post as jest.Mock).mockResolvedValue({
      data: 100,
      statusCode: 200
    });

    const result = await communityService.createPost(request);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/community/posts', request);
    expect(result.data).toBe(100);
  });

  it('toggleLike는 게시물 좋아요 상태를 성공적으로 토글해야 한다', async () => {
    const mockLikeResponse = { liked: true, likeCount: 10 };
    (apiService.post as jest.Mock).mockResolvedValue({
      data: mockLikeResponse,
      statusCode: 200
    });

    const result = await communityService.toggleLike(1);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/community/posts/1/like');
    expect(result.data).toEqual(mockLikeResponse);
  });

  it('deletePost는 게시물을 성공적으로 삭제해야 한다', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await communityService.deletePost(1);

    expect(apiService.delete).toHaveBeenCalledWith('/api/v1/community/posts/1');
  });
});
