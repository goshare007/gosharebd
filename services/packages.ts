import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import type {
  AdminPackageWithGalleryType,
  AllPackagesType,
  SinglePackageType,
} from '@/types/package';

export const useAddPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const apiPromise = axios.post('/api/packages/admin/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.promise(apiPromise, {
        loading: 'Adding Package, please wait...',
        success: 'Package added successfully!',
        // biome-ignore lint/suspicious/noExplicitAny: this is fine
        error: (err: any) =>
          err?.response?.data?.message || 'Failed to add the package.',
      });

      const response = await apiPromise;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.All_DESTINATION] });
    },
  });
};

export const useSinglePackages = (slug: string) => {
  return useQuery<SinglePackageType>({
    queryKey: [QUERY_KEYS.SINGLE_PACKAGES, slug],
    queryFn: async () => {
      const response = await axios.get<SinglePackageType>(
        '/api/packages/single-package',
        {
          params: { slug },
        },
      );
      return response.data;
    },
  });
};

export const useAllPackages = () => {
  return useQuery<AllPackagesType[]>({
    queryKey: [QUERY_KEYS.ALL_PACKAGES],
    queryFn: async () => {
      const response = await axios.get<AllPackagesType[]>('/api/packages/all');
      return response.data;
    },
  });
};

export const usePopularPackages = () => {
  return useQuery<AllPackagesType[]>({
    queryKey: [QUERY_KEYS.ALL_PACKAGES],
    queryFn: async () => {
      const response = await axios.get<AllPackagesType[]>(
        '/api/packages/popular',
      );
      return response.data;
    },
  });
};

async function deletePackage(packageId: string): Promise<void> {
  await axios.delete(`/api/packages/single-package?packageId=${packageId}`);
}

export function useDeletePackage(destinationId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      toast.success('Package deleted successfully');
      if (destinationId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SINGLE_DESTINATION_PACKAGES, destinationId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_PACKAGES] });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        'Something went wrong';
      toast.error(message);
    },
  });
}

async function updatePackage({
  packageId,
  formData,
}: {
  packageId: string;
  formData: FormData;
}): Promise<void> {
  await axios.patch(
    `/api/packages/single-package?packageId=${packageId}`,
    formData,
  );
}

export function useUpdatePackage(packageId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePackage,
    onSuccess: () => {
      toast.success('Package updated successfully');
      // Invalidate the single package query so it refetches fresh data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_PACKAGES, packageId],
      });
      // Also invalidate destination-wise packages list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.All_DESTINATION] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_PACKAGES] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        'Something went wrong';
      toast.error(message);
    },
  });
}

export const useAdminPackagesWithGallery = () => {
  return useQuery<AdminPackageWithGalleryType[]>({
    queryKey: [QUERY_KEYS.ADMIN_PACKAGES_WITH_GALLERY],
    queryFn: async () => {
      const response = await axios.get<AdminPackageWithGalleryType[]>(
        '/api/admin/packages/with-gallery',
      );
      return response.data;
    },
  });
};
