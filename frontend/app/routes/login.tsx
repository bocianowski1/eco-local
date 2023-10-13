import { Form, Link } from "@remix-run/react";
import { redirect, type ActionFunction } from "@remix-run/node";
import { styles } from "~/common/styles";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  if (!body.get("email") || !body.get("password")) {
    throw new Response("Missing email or password", {
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
      password: body.get("password"),
    }),
  });

  if (response.status !== 200) {
    throw new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const user = await response.json();

  return redirect(`/users/${user.id}?token=${user.token}`);
};

export default function Login() {
  return (
    <div>
      <div className="w-80 mx-auto mt-24">
        <h1 className="font-bold text-2xl mb-6">Login</h1>
        <Form
          action="/login"
          method="POST"
          className="flex flex-col gap-8 text-black"
        >
          <input
            type="email"
            className={styles.input}
            name="email"
            placeholder="Email..."
          />
          <input
            type="password"
            className={styles.input}
            name="password"
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
