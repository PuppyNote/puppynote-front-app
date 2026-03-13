import { apiService, ApiResponse } from '../ApiService';
import { Post, PostListResponse, CreatePostRequest, UpdatePostRequest } from '../../types/Community';

class CommunityService {
  private readonly BASE_PATH = '/api/v1/community/posts';

  /**
   * 게시물 등록
   */
  async createPost(request: CreatePostRequest): Promise<ApiResponse<number>> {
    return apiService.post<number>(this.BASE_PATH, request);
  }

  /**
   * 게시물 목록 조회 (검색 포함)
   */
  async getPosts(page: number = 0, size: number = 20, keyword?: string): Promise<ApiResponse<PostListResponse>> {
    const params: any = { page, size };
    if (keyword) {
      params.keyword = keyword;
    }
    return apiService.get<PostListResponse>(this.BASE_PATH, { params });
  }

  /**
   * 게시물 단건 조회
   */
  async getPostById(postId: number): Promise<ApiResponse<Post>> {
    return apiService.get<Post>(`${this.BASE_PATH}/${postId}`);
  }

  /**
   * 게시물 수정
   */
  async updatePost(postId: number, request: UpdatePostRequest): Promise<ApiResponse<null>> {
    return apiService.patch<null>(`${this.BASE_PATH}/${postId}`, request);
  }
}

export const communityService = new CommunityService();
