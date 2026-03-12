import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import type {
  AdminReviewListType,
  PackageReviewsType,
  SubmitReviewPayload,
} from '@/types/review';

export const useSubmitReview = () => {
  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      const formData = new FormData();
      formData.append('packageId', payload.packageId);
      formData.append('rating', String(payload.rating));
      formData.append('comment', payload.comment);

      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((file) => {
          formData.append('images', file);
        });
      }

      const response = await axios.post('/api/reviews/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        'Review submitted successfully! It will be visible after approval.',
      );
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to submit review';
      toast.error(message);
    },
  });
};

export const usePackageReviews = (
  slug: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery<PackageReviewsType>({
    queryKey: [QUERY_KEYS.PACKAGE_REVIEWS, slug, page, limit],
    queryFn: async () => {
      const response = await axios.get<PackageReviewsType>(
        `/api/reviews/package/${slug}`,
        {
          params: { page, limit },
        },
      );
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useAdminReviews = ({
  page = 1,
  limit = 10,
  approved,
  packageSlug,
}: {
  page?: number;
  limit?: number;
  approved?: boolean;
  packageSlug?: string;
} = {}) => {
  return useQuery<AdminReviewListType>({
    queryKey: [QUERY_KEYS.ADMIN_REVIEWS, page, limit, approved, packageSlug],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (approved !== undefined) {
        params.set('approved', String(approved));
      }
      if (packageSlug) {
        params.set('package', packageSlug);
      }
      const response = await axios.get<AdminReviewListType>(
        `/api/admin/reviews?${params}`,
      );
      return response.data;
    },
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const response = await axios.patch(`/api/admin/reviews/${id}`, {
        approved,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Review status updated');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REVIEWS] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update review';
      toast.error(message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/reviews/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REVIEWS] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete review';
      toast.error(message);
    },
  });
};
