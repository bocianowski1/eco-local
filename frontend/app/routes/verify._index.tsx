import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { verifyEmail } from "~/common/utils";

export const loader: LoaderFunction = async ({ request }) => {
  let email = request.url.split("?email=")[1].split("&")[0];

  if (!email) {
    return json({ email: "Missing email" }, { status: 400 });
  }

  email = email.replace("%40", "@");
  if (!verifyEmail(email)) {
    return json({ email: "Invalid email" }, { status: 400 });
  }

  const response = await fetch("http://localhost:8080/api/users/verify", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (response.status !== 200) {
    return json({ email: "Something went wrong" }, { status: 400 });
  }

  return json(await response.json());
};

export default function Verify() {
  const email = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Verify</h1>
      <p>{JSON.stringify(email)} verified</p>
    </div>
  );
}
