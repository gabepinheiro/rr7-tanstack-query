import { Form, href, Link, NavLink, Outlet, useNavigation, useSubmit } from "react-router";
import type { Route } from "./+types/sidebar";
import { getContacts } from "../data";
import { useEffect } from "react";
import { getQueryClient } from "../middlewares/query-client";

export async function clientLoader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  const queryClient = getQueryClient(context)

  const contacts = await queryClient.fetchQuery({
    queryKey: ['contacts:sidebar', { q }],
    queryFn: () => getContacts(q)
  })

  return { contacts, q }
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData // or useQuery / useSuspenseQuery

  const navigation = useNavigation()
  const submit = useSubmit()

  const searching = 
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    const searchField = document.getElementById('q')
    if(searchField instanceof HTMLInputElement) {
      searchField.value = q || ''
    }
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to={href('/about')}>React Router Contacts</Link>
        </h1>
        <div>
          <Form 
            id="search-form" 
            role="search"
            onChange={event => {
              const isFirstSearch = q === null
              submit(event.currentTarget, { replace: !isFirstSearch })
            }}
          >
            <input
              className={searching ? 'loading' : ""}
              aria-label="Search contacts"
              defaultValue={q || ''}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map(contact => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) => (
                      isActive
                        ? 'active'
                        : isPending
                          ? 'pending'
                          : ''
                    )}
                    to={href('/contacts/:contactId', { contactId: contact.id })}
                  >
                    {contact.first || contact.last ? (
                      <>{contact.first} {contact.last}</>
                    ) : (
                      <i>No name</i>
                    )}

                    {contact.favorite ? (
                      <span>★</span>
                    ) : null}
                  </NavLink>
                </li>
              ))}

            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>

      <div 
        id='detail'
        className={
          navigation.state === 'loading' && !searching ? 'loading' : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}
