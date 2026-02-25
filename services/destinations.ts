import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { DestinationType } from '@/types/destination';

export const useAddDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const apiPromise = axios.post('/api/destinations/admin/add', formData, {
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

export const useAllDestinations = () => {
  return useQuery<DestinationType[]>({
    queryKey: [QUERY_KEYS.All_DESTINATION],
    queryFn: async () => {
      const response = await axios.get<DestinationType[]>('/api/destinations');
      return response.data;
    },
  });
};

export const useSingleDestinations = (id: string) => {
  return useQuery<DestinationType>({
    queryKey: [QUERY_KEYS.SINGLE_DESTINATION, id],
    queryFn: async () => {
      const response = await axios.get<DestinationType>(
        `/api/destinations/single?id=${id}`,
      );
      return response.data;
    },
  });
};

// Update mutation — accepts FormData
export const useUpdateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const apiPromise = axios.put('/api/destinations/admin/edit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.promise(apiPromise, {
        loading: 'Updating destination, please wait...',
        success: 'Destination updated successfully!',
        // biome-ignore lint/suspicious/noExplicitAny: this is fine
        error: (err: any) =>
          err?.response?.data?.message || 'Failed to update destination',
      });
      const response = await apiPromise;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.All_DESTINATION] });
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const apiPromise = axios.delete(
        `/api/destinations/admin/delete?id=${id}`,
      );
      toast.promise(apiPromise, {
        loading: 'Deleting destination, please wait...',
        success: 'Destination deleted successfully!',
        // biome-ignore lint/suspicious/noExplicitAny: this is fine
        error: (err: any) =>
          err?.response?.data?.message || 'Failed to delete destination',
      });
      const response = await apiPromise;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.All_DESTINATION] });
    },
  });
};
