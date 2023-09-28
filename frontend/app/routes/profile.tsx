import { redirect } from "@remix-run/node";
import useAuth from "~/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="font-bold text-4xl">Profile</h1>
    </div>
  );
}
