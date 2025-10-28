// types/models.types.ts

// The source of truth for our primary data structures, mirroring the backend
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };  likeCount: number;
  commentCount: number;
  // This field is client-side computed, but useful to include in the Post type
  isLikedByCurrentUser?: boolean; 
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  postId: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Like {
  _id: string;
  userId: string;
  onModel: 'Post' | 'Comment';
  resourceId: string;
  createdAt: string;
}