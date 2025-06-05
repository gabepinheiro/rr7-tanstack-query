import type { QueryClient } from "@tanstack/react-query";
import { unstable_createContext, unstable_RouterContextProvider } from "react-router";

export const QueryClientContext = unstable_createContext<QueryClient>()

export function getQueryClient (context: unstable_RouterContextProvider) {
  return context.get(QueryClientContext)
}
