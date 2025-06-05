import { redirect } from "react-router";
import { deleteContact } from "../data";
import type { Route } from "./+types/destroy-contact";
import { getQueryClient } from "../middlewares/query-client";

export async function clientAction ({ params, context }: Route.ActionArgs) {
  const queryClient = getQueryClient(context)

  await deleteContact(params.contactId)

  queryClient.removeQueries({
    queryKey: ['contact-details', { contactId: params.contactId }]
  })

  queryClient.invalidateQueries({
    queryKey: ['contacts:sidebar']
  })

  return redirect('/')
}
