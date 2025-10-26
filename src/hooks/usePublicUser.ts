import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user.api';
import { User } from '../types/models.types';

const PUBLIC_USER_QUERY_KEY = 'publicUser';

/**
 * 👤 usePublicProfile: Handles fetching the read-only profile data for another user.
 */
export const usePublicProfile = (userId: string) => {
  return useQuery<User>({
    queryKey: [PUBLIC_USER_QUERY_KEY, userId], 
    queryFn: () => userApi.getPublicProfile(userId),
    enabled: !!userId, // Only fetch if userId is present
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};