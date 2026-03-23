export interface Post {
  postId: number;
  userId: number;
  userNickname: string;
  userProfileUrl: string;
  content: string;
  imageKeys: string[];
  imageUrls: string[];
  hashtags: string[];
  createdDate: string;
  likeCount: number;
  liked: boolean;
}

export interface LikeResponse {
  liked: boolean;
  likeCount: number;
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
  addImageKeys?: string[];
  deleteImageKeys?: string[];
}
