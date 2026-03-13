export interface Post {
  postId: number;
  userId: number;
  userNickname: string;
  userProfileUrl: string;
  content: string;
  imageUrls: string[];
  hashtags: string[];
  createdDate: string;
}

export interface PostListResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface CreatePostRequest {
  content: string;
  hashtags?: string[];
  imageKeys?: string[];
}

export interface UpdatePostRequest {
  content: string;
  hashtags?: string[];
  imageKeys?: string[];
}
