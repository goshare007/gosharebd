import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { WishlistType } from '@/types/wishlist';

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId: string) => {
      const p = axios.post('/api/user/wishlist/toggle', { packageId });
      toast.promise(p, {
        loading: 'Updating…',
        success: 'Wishlist updated',
        error: 'Failed to update',
      });
      return (await p).data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_WISHLIST],
      }),
  });
};

export const useWishlist = (packageId: string) => {
  const { mutate: toggleWishlist, isPending: isToggling } = useToggleWishlist();

  const { data: wishlistData } = useQuery({
    queryKey: [QUERY_KEYS.USER_WISHLIST, packageId],
    queryFn: async () => {
      const res = await axios.get(`/api/user/wishlist?packageId=${packageId}`);
      return res.data;
    },
  });

  return {
    isWishlisted: wishlistData?.wishlisted ?? false,
    toggleWishlist: () => toggleWishlist(packageId),
    isToggling,
  };
};

export const useWishlistPackages = () => {
  return useQuery<WishlistType[]>({
    queryKey: [QUERY_KEYS.USER_WISHLIST],
    queryFn: async () => {
      const res = await axios.get<WishlistType[]>('/api/user/wishlist/all');
      return res.data;
    },
  });
};
