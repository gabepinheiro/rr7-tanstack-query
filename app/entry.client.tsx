import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { QueryClientContext } from "./middlewares/query-client";
import { queryClient } from "./lib/query-client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter
          unstable_getContext={() => new Map([[QueryClientContext, queryClient]])}
      />
    </StrictMode>
  );
});
