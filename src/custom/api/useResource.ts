import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export function useResource<T>(resource: string): UseQueryResult<T, undefined> {
  return useQuery<T, undefined>({
    queryKey: ['', resource],
    queryFn: async () => {
      const { data } = await axios.get<T, AxiosResponse<T>>(resource);

      return data;
    },
  });
}
