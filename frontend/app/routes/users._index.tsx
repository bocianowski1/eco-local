import { type ActionFunction, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { styles } from "~/common/styles";
import { type User } from "~/common/types";
import { TrashIcon } from "~/components/icons";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const id = body.get("id")?.toString();
  const token = body.get("token");
  if (!token) {
    return new Response("Missing token", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  const response = await fetch(`http://localhost:8080/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "x-jwt-token": token.toString(),
    },
  });

  if (response.status !== 200) {
    return new Response("Something went wrong", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return json({ message: "success" }, { status: 200 });
};

export const loader = async () => {
  const res = await fetch("http://localhost:8080/api/users");
  return json(await res.json());
};

export default function Accounts() {
  const users = useLoaderData<typeof loader>();
  const [showDelete, setShowDelete] = useState(false);
  return (
    <main className="">
      <h1 className="font-bold text-4xl ">Users</h1>
      <p className="pb-4 font-thin">{users.length} users</p>
      {!users ||
        (users.length === 0 && (
          <div>
            <p>No users found.</p>
            <Link className={styles.link} to="/login">
              Login
            </Link>
          </div>
        ))}
      {users && users.length > 0 && (
        <ul className="flex flex-col gap-2">
          {users.map((user: User) => (
            <li
              key={user.id}
              className="grid grid-cols-2"
              onClick={() => setShowDelete(true)}
            >
              <p className="">
                {user.firstName} {user.lastName}
              </p>
              {showDelete && (
                <Form action="/users" method="DELETE">
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="token" value={user.token} />
                  <button
                    className="h-fit w-fit"
                    onClick={() => setShowDelete(false)}
                  >
                    <TrashIcon />
                  </button>
                </Form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
