import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { GalleryItem, SinglePackageImages } from '@/types/gallery';

export const useGalleryImages = () => {
  return useQuery<GalleryItem[]>({
    queryKey: [QUERY_KEYS.GALLERY_IMAGES],
    queryFn: async () => {
      const response = await axios.get<GalleryItem[]>('/api/gallery');
      return response.data;
    },
  });
};

export const useSinglePackageImages = (packageId: string) => {
  return useQuery<SinglePackageImages>({
    queryKey: [QUERY_KEYS.GALLERY_IMAGES, packageId],
    queryFn: async () => {
      const response = await axios.get<SinglePackageImages>(
        `/api/gallery/package?packageId=${packageId}`,
        {
          params: { packageId },
        },
      );
      return response.data;
    },
  });
};

// --- Mutations for Admin Gallery Management ---

interface AddImagePayload {
  packageId: string;
  imageUrl: string;
  publicId: string;
}

export const addImageToPackage = async ({
  packageId,
  imageUrl,
  publicId,
}: AddImagePayload) => {
  const response = await axios.post(
    `/api/admin/packages/${packageId}/gallery`,
    {
      imageUrl,
      publicId,
    },
  );
  return response.data;
};

interface DeleteImagePayload {
  packageId: string;
  imageId: string;
}

export const deleteImageFromPackage = async ({
  packageId,
  imageId,
}: DeleteImagePayload) => {
  const response = await axios.delete(
    `/api/admin/packages/${packageId}/gallery/${imageId}`,
  );
  return response.data;
};

export const uploadGalleryImage = async (
  formData: FormData,
): Promise<{ imageUrl: string; publicId: string }> => {
  const response = await axios.post('/api/admin/gallery/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
