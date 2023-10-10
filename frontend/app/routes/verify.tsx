import { json, redirect } from "@remix-run/node";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { styles } from "~/common/styles";
import { type User } from "~/common/types";
import { verifyEmail } from "~/common/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let email = request.url.split("?email=")[1].split("&")[0];

  if (!email) {
    redirect("/");
  }

  email = email.replace("%40", "@");
  if (!verifyEmail(email)) {
    throw new Response("Invalid email", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const response = await fetch("http://localhost:8080/api/users/verify", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (response.status !== 200) {
    throw new Response("Something went wrong", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const user: User = await response.json();

  return json({ user });
};

export default function Verify() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="font-bold text-2xl">You are verified {user.firstName}</h1>
      <Link
        className={styles.link}
        to={`/users/${user.id}?token=${user.token}`}
      >
        Go to your profile
      </Link>
    </div>
  );
}
