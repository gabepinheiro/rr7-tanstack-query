import { remember } from "@epic-web/remember";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = remember('query-client',() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10
    }
  }
}))
