import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { SingleDestinationType } from '@/types/destination';
import type { AllPackagesType, SinglePackageType } from '@/types/package';

export const useDestinationWisePackages = (id: string) => {
  return useQuery<SingleDestinationType>({
    queryKey: [QUERY_KEYS.SINGLE_DESTINATION_PACKAGES, id],
    queryFn: async () => {
      const response = await axios.get<SingleDestinationType>(
        '/api/packages/destination',
        {
          params: { id },
        },
      );
      return response.data;
    },
  });
};

export const useAddPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const apiPromise = axios.post('/api/packages/admin/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.promise(apiPromise, {
        loading: 'Adding Destination, please wait...',
        success: 'Destination added successfully!',
        // biome-ignore lint/suspicious/noExplicitAny: this is fine
        error: (err: any) =>
          err?.response?.data?.message || 'Failed to add destination',
      });

      const response = await apiPromise;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.All_DESTINATION] });
    },
  });
};

export const useSinglePackages = (PackageId: string) => {
  return useQuery<SinglePackageType>({
    queryKey: [QUERY_KEYS.SINGLE_PACKAGES, PackageId],
    queryFn: async () => {
      const response = await axios.get<SinglePackageType>(
        '/api/packages/single-package',
        {
          params: { packageId: PackageId },
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
