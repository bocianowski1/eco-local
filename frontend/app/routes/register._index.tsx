import { Form } from "@remix-run/react";
import { redirect, type ActionFunction } from "@remix-run/node";
import { styles } from "~/common/styles";
import type { User } from "~/common/types";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  if (
    !body.get("firstName") ||
    !body.get("lastName") ||
    !body.get("email") ||
    !body.get("password")
  ) {
    return new Response("Missing first or last name or email or password", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  let response = await fetch("http://localhost:8080/api/users", {
    method: "POST",
    body: JSON.stringify({
      firstName: body.get("firstName"),
      lastName: body.get("lastName"),
      email: body.get("email"),
      password: body.get("password"),
    }),
  });

  if (response.status === 400) {
    const text = await response.text();
    throw new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (response.status !== 201 || !response.ok) {
    throw new Response("Something went wrong", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const user: User = await response.json();

  response = await fetch("http://localhost:7071/api/verify", {
    method: "POST",
    body: JSON.stringify({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }),
  });

  if (response.status !== 202) {
    throw new Response("Something went wrong", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return redirect(`/users/${user.id}?token=${user.token}`);
};

export default function Register() {
  return (
    <div>
      <div className="w-80 mx-auto mt-24">
        <h1 className="font-bold text-2xl mb-6">Register</h1>
        <Form
          action="/register"
          method="POST"
          className="flex flex-col gap-8 text-black"
        >
          <input
            type="text"
            className={styles.input}
            name="firstName"
            placeholder="Jane"
          />
          <input
            type="text"
            className={styles.input}
            name="lastName"
            placeholder="Doe"
          />
          <input
            type="email"
            className={styles.input}
            name="email"
            placeholder="janedoe@gmail.com"
          />
          <input
            type="password"
            className={styles.input}
            name="password"
            placeholder="Password..."
          />
          <div className="flex justify-center text-white/80 text-lg">
            <button type="submit" className={styles.submitButtonLarge}>
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
