import { Form, Link } from "@remix-run/react";
import { redirect, type ActionFunction } from "@remix-run/node";
import { styles } from "~/common/styles";
import React from "react";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  if (!body.get("email")) {
    throw new Response("Missing email", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  const response = await fetch("http://localhost:8080/api/login", {
    method: "POST",
    body: JSON.stringify({
      email: body.get("email"),
    }),
  });

  if (response.status !== 200) {
    throw new Response("Something went wrong", {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const account = await response.json();

  return redirect(`/accounts/${account.id}?token=${account.token}`);
};

// function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//   event.preventDefault();
//   const emailInput = document.querySelector("input[name='email']");
//   const passwordInput = document.querySelector("input[name='password']");

//   if (!emailInput || !passwordInput) {
//     alert("Something went wrong");
//     return;
//   }

//   console.log(emailInput, passwordInput, typeof emailInput);
// }

export default function Login() {
  return (
    <div>
      <div className="w-1/3 mx-auto mt-24">
        <h1 className="font-bold text-2xl mb-6">Login</h1>
        <Form
          action="/login"
          method="POST"
          className="flex flex-col gap-8 text-black"
          // onSubmit={(e) => handleSubmit(e)}
        >
          <input
            type="email"
            className="px-4 py-2 border-2 focus:border-primary focus:outline-none focus:ring-0"
            name="email"
            placeholder="Email..."
          />
          <input
            type="password"
            className="px-4 py-2 border-2 focus:border-primary focus:outline-none focus:ring-0"
            // name="password"
            placeholder="Password..."
          />
          <div className="flex justify-center text-white/80 text-lg">
            <button type="submit" className={styles.submitButtonLarge}>
              Login
            </button>
          </div>
        </Form>
        <p className="text-sm mt-4">
          <span className="font-light">New here?</span>{" "}
          <Link to="/register" className={styles.link}>
            Register here!
          </Link>
        </p>
      </div>
    </div>
  );
}
