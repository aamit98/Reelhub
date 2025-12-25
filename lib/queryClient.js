import { QueryClient } from "@tanstack/react-query";

// Create a query client with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 30 seconds (data is considered fresh for 30s)
      staleTime: 30 * 1000,
      // Cache time: 5 minutes (unused data stays in cache for 5min)
      gcTime: 5 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (good for mobile apps)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});


