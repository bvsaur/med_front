export interface Post {
  id: number;
  title: string;
  slug: string;
  author: Author;
  body: string;
  description: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  image: { url: string };
  comments: Comment[];
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  image: { url: string };
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  comment: string;
  post: Post;
  published_at: string;
  created_at: string;
  updated_at: string;
}
