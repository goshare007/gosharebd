import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { GalleryItem, SinglePackageImages } from '@/types/gallery';

// ─── Query Hooks ─────────────────────────────────────────────────────────────

export const useGalleryImages = () => {
  return useQuery<GalleryItem[]>({
    queryKey: [QUERY_KEYS.GALLERY_IMAGES],
    queryFn: async () => {
      const { data } = await axios.get<GalleryItem[]>('/api/gallery');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 min — gallery doesn't change often
  });
};

export const useSinglePackageImages = (packageId: string) => {
  return useQuery<SinglePackageImages>({
    queryKey: [QUERY_KEYS.GALLERY_IMAGES, packageId],
    queryFn: async () => {
      const { data } = await axios.get<SinglePackageImages>(
        `/api/gallery/package`,
        { params: { packageId } }, // ✅ single source of truth for the param
      );
      return data;
    },
    enabled: Boolean(packageId), // ✅ skip fetch if packageId is empty
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

interface AddImagePayload {
  packageId: string;
  imageUrl: string;
  publicId: string;
}

export const useAddImageToPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ packageId, imageUrl, publicId }: AddImagePayload) => {
      const { data } = await axios.post(
        `/api/admin/packages/${packageId}/gallery`,
        { imageUrl, publicId },
      );
      return data;
    },
    onSuccess: (_, { packageId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GALLERY_IMAGES, packageId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GALLERY_IMAGES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_PACKAGES_WITH_GALLERY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_PACKAGES_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_SINGLE_PACKAGE_WITH_GALLERY, packageId],
      });
    },
  });
};

interface DeleteImagePayload {
  packageId: string;
  imageId: string;
}

export const useDeleteImageFromPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ packageId, imageId }: DeleteImagePayload) => {
      const { data } = await axios.delete(
        `/api/admin/packages/${packageId}/gallery/${imageId}`,
      );
      return data;
    },
    onSuccess: (_, { packageId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GALLERY_IMAGES, packageId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GALLERY_IMAGES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_PACKAGES_WITH_GALLERY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_PACKAGES_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ADMIN_SINGLE_PACKAGE_WITH_GALLERY, packageId],
      });
    },
  });
};

interface UploadResponse {
  imageUrl: string;
  publicId: string;
}

export const useUploadGalleryImage = (
  options?: UseMutationOptions<UploadResponse, Error, FormData>,
) => {
  return useMutation({
    mutationFn: async (formData: FormData): Promise<UploadResponse> => {
      const { data } = await axios.post<UploadResponse>(
        '/api/admin/gallery/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data;
    },
    ...options,
  });
};
