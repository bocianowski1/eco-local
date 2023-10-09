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
  const response = await fetch("http://localhost:8080/api/users", {
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
            className="px-4 py-2 border-2 focus:border-primary focus:outline-none focus:ring-0"
            name="firstName"
            placeholder="Jane"
          />
          <input
            type="text"
            className="px-4 py-2 border-2 focus:border-primary focus:outline-none focus:ring-0"
            name="lastName"
            placeholder="Doe"
          />
          <input
            type="email"
            className="px-4 py-2 border-2 focus:border-primary focus:outline-none focus:ring-0"
            name="email"
            placeholder="janedoe@gmail.com"
          />
          <input
            type="password"
            className="px-4 py-2 border-2 focus:border-primary focus:outline-none focus:ring-0"
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
