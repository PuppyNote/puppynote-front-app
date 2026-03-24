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
    const mockRes = { posts: [], currentPage: 0, totalPages: 1, totalCount: 0 };
    (apiService.get as jest.Mock).mockResolvedValue({ data: mockRes, statusCode: 200 });
    const res = await communityService.getPosts(0, 20, 'tag');
    expect(apiService.get).toHaveBeenCalledWith('/api/v1/community/posts', {
      params: { page: 0, size: 20, keyword: 'tag' }
    });
    expect(res.data).toEqual(mockRes);
  });

  it('getPosts는 기본 파라미터 및 keyword 없이 조회해야 한다', async () => {
    const mockRes = { posts: [], currentPage: 0, totalPages: 1, totalCount: 0 };
    (apiService.get as jest.Mock).mockResolvedValue({ data: mockRes, statusCode: 200 });
    await communityService.getPosts();
    expect(apiService.get).toHaveBeenCalledWith('/api/v1/community/posts', {
      params: { page: 0, size: 20 }
    });
  });

  it('getMyPosts는 내 게시물 목록을 성공적으로 조회해야 한다', async () => {
    const mockRes = { posts: [], currentPage: 0, totalPages: 1, totalCount: 0 };
    (apiService.get as jest.Mock).mockResolvedValue({ data: mockRes, statusCode: 200 });
    const res = await communityService.getMyPosts(0, 10);
    expect(apiService.get).toHaveBeenCalledWith('/api/v1/community/posts/my', {
      params: { page: 0, size: 10 }
    });
    expect(res.data).toEqual(mockRes);

    await communityService.getMyPosts();
  });

  it('getPostById는 게시물 단건 조회를 성공적으로 수행해야 한다', async () => {
    const mockPost = { postId: 1, content: 'c' };
    (apiService.get as jest.Mock).mockResolvedValue({ data: mockPost, statusCode: 200 });
    const res = await communityService.getPostById(1);
    expect(apiService.get).toHaveBeenCalledWith('/api/v1/community/posts/1');
    expect(res.data).toEqual(mockPost);
  });

  it('getHashtags는 해시태그 자동완성 목록을 가져와야 한다', async () => {
    const mockTags = ['강아지', '고양이'];
    (apiService.get as jest.Mock).mockResolvedValue({ data: mockTags, statusCode: 200 });
    const res = await communityService.getHashtags('강');
    expect(apiService.get).toHaveBeenCalledWith('/api/v1/community/posts/hashtags', {
      params: { keyword: '강' }
    });
    expect(res.data).toEqual(mockTags);
  });

  it('createPost는 새 게시물을 등록해야 한다', async () => {
    (apiService.post as jest.Mock).mockResolvedValue({ data: 1, statusCode: 200 });
    const res = await communityService.createPost({ content: 'c' });
    expect(res.data).toBe(1);
  });

  it('updatePost는 게시물을 수정해야 한다', async () => {
    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await communityService.updatePost(1, { content: 'new' });
    expect(apiService.patch).toHaveBeenCalledWith('/api/v1/community/posts/1', { content: 'new' });
  });

  it('deletePost는 게시물을 삭제해야 한다', async () => {
    (apiService.delete as jest.Mock).mockResolvedValue({ statusCode: 200 });
    await communityService.deletePost(1);
    expect(apiService.delete).toHaveBeenCalledWith('/api/v1/community/posts/1');
  });

  it('toggleLike는 좋아요를 토글해야 한다', async () => {
    const mockLike = { liked: true, likeCount: 5 };
    (apiService.post as jest.Mock).mockResolvedValue({ data: mockLike, statusCode: 200 });
    const res = await communityService.toggleLike(1);
    expect(apiService.post).toHaveBeenCalledWith('/api/v1/community/posts/1/like');
    expect(res.data).toEqual(mockLike);
  });
});
