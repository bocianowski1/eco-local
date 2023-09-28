import { Form } from "@remix-run/react";
import { redirect, type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  if (!body.get("firstName") || !body.get("lastName") || !body.get("email")) {
    return new Response("Missing first or last name or email", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  const response = await fetch("http://localhost:8080/api/accounts", {
    method: "POST",
    body: JSON.stringify({
      firstName: body.get("firstName"),
      lastName: body.get("lastName"),
      email: body.get("email"),
    }),
  });

  if (response.status === 400) {
    const text = await response.text();
    return new Response(text, {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (response.status !== 201 || !response.ok) {
    return new Response("Something went wrong", {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const account = await response.json();

  return redirect(`/accounts/${account.id}?token=${account.token}`);
};

export default function Register() {
  return (
    <div>
      <div className="w-1/3 mx-auto mt-24">
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
          <div className="flex justify-center text-white/80 text-lg">
            <button
              type="submit"
              className="font-medium text-lg px-12 flex justify-center py-3 rounded-sm
                      bg-primary text-white hover:bg-accent transition-colors duration-200"
            >
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
