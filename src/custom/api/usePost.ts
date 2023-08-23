import { UseMutationResult, useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

/**
 * @param resource - path of the resource
 * @param url - baseUrl of the resource
 * @typeParam TBody - type of the request
 * @typeParam TResponse - type of the response
 * @returns
 */
export function usePost<TBody, TResponse = null>(
  resource: string,
  url?: string,
): UseMutationResult<
  TResponse,
  unknown,
  { params?: Record<string, string>; payload?: TBody },
  unknown
> {
  const baseURL = url ?? import.meta.env.VITE_BASE_API;
  let fullUrl = baseURL ? `${baseURL}/${resource}` : `/${resource}`;

  return useMutation<
    TResponse,
    unknown,
    { params?: Record<string, string>; payload?: TBody },
    unknown
  >({
    mutationKey: [resource],
    mutationFn: async ({ params, payload }) => {
      const queryParams = new URLSearchParams(params).toString();
      if (queryParams) {
        fullUrl = fullUrl.concat(`?${queryParams}`);
      }
      const decodedURL = decodeURIComponent(fullUrl);

      const { data: responseData } = await axios.post<
        TBody,
        AxiosResponse<TResponse>
      >(decodedURL, payload);
      return responseData;
    },
  });
}
