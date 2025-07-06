import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';
import { fetchWithAuth } from '@/lib/utils';
import { ExtendedError } from '@/lib/classes/ExtendedError';
import { Profile } from '@/types';

export default function useProfileData() {
  return useQuery<Profile | null, ExtendedError>({
    queryKey: ['profile'],
    queryFn: async function () {
      const response = await fetchWithAuth(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ExtendedError(`Failed to fetch profile data: ${errorText}`, { code: response.status });
      }

      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}