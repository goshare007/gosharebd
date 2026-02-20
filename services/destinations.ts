import { QUERY_KEYS } from '@/constants/query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

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
  return useQuery({
    queryKey: [QUERY_KEYS.All_DESTINATION],
    queryFn: async () => {
      const response = await axios.get('/api/destinations');
      return response.data;
    },
  });
};
