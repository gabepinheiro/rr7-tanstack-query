import { Form, redirect, useNavigate } from "react-router";
import { getContact, updateContact } from "../data";
import type { Route } from "./+types/edit-contact";
import { getQueryClient } from "../middlewares/query-client";

export async function clientAction ({ params, request, context }: Route.ActionArgs) {
  const formData = await request.formData()
  
  const queryClient = getQueryClient(context)

  const updates = Object.fromEntries(formData)
  await updateContact(params.contactId, updates)

  queryClient.invalidateQueries({
    queryKey: ['contact-details', { contactId: params.contactId }]
  })

  queryClient.invalidateQueries({
    queryKey: ['contacts:sidebar']
  })

  return redirect(`/contacts/${params.contactId}`)

} 

export async function clientLoader ({ params, context }: Route.LoaderArgs) {
  const queryClient = getQueryClient(context)

  const contact = await queryClient.fetchQuery({
    queryKey: ['contact-details', { contactId: params.contactId }],
    queryFn: () => getContact(params.contactId)
  })

  if(!contact) {
    throw new Response('Not Found', { status: 404 })
  }

  return { contact }
}

export default function EditContact({
  loaderData,
}: Route.ComponentProps) {
  const { contact } = loaderData // or useQuery / useSuspenseQuery

  const navigate = useNavigate()

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </p>
    </Form>
  );
}
