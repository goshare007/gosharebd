import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageId: string;
  metaImage: string | null;
  metaImageId: string | null;
  categoryId: string;
  category?: BlogCategory;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  viewCount: number;
  authorId: string;
  author?: { id: string; name: string; image: string | null };
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListItem extends BlogPost {
  _count?: { comments: number; images: number };
}

export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/blog/categories');
      return data;
    },
  });
}

export function useAdminBlogPosts(status?: string) {
  return useQuery<BlogPostListItem[]>({
    queryKey: ['admin-blog-posts', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const { data } = await axios.get(`/api/admin/blog${params}`);
      return data;
    },
  });
}

export function useAdminBlogPost(id: string) {
  return useQuery<BlogPost>({
    queryKey: ['admin-blog-post', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/blog/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  return useMutation({
    mutationFn: async (formData: Partial<BlogPost>) => {
      const { data } = await axios.post('/api/admin/blog', formData);
      return data;
    },
    onSuccess: () => {
      toast.success('Post created successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to create post');
    },
  });
}

export function useUpdateBlogPost() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<BlogPost>;
    }) => {
      const { data: response } = await axios.put(`/api/admin/blog/${id}`, data);
      return response;
    },
    onSuccess: () => {
      toast.success('Post updated successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to update post');
    },
  });
}

export function useDeleteBlogPost() {
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      toast.success('Post deleted successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to delete post');
    },
  });
}

export function usePublicBlogPosts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}) {
  return useQuery<{
    posts: BlogPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ['public-blog-posts', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.category) searchParams.set('category', params.category);
      if (params?.tag) searchParams.set('tag', params.tag);
      const query = searchParams.toString();
      const { data } = await axios.get(`/api/blog${query ? `?${query}` : ''}`);
      return data;
    },
  });
}

export function usePublicBlogPost(slug: string) {
  return useQuery<BlogPost>({
    queryKey: ['public-blog-post', slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/blog/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}

export async function uploadBlogImage(file: File, postId?: string) {
  const formData = new FormData();
  formData.append('image', file);
  if (postId) formData.append('postId', postId);
  const { data } = await axios.post<{ url: string; publicId: string }>(
    '/api/admin/blog/image-upload',
    formData,
  );
  return data;
}
