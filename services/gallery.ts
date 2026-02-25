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
