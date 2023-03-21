import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 0,
      // cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

// 특정 키에만 따로 설정해보기
// queryClient.setQueryDefaults(todoKeys.all, { staleTime: 1000 * 5 })
