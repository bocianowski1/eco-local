import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { styles } from "~/common/styles";
import { type Account } from "~/common/types";

export const loader = async () => {
  const res = await fetch("http://localhost:8080/api/users");
  return json(await res.json());
};

export default function Accounts() {
  const users = useLoaderData<typeof loader>();
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
        <ul>
          {users.map((account: Account) => (
            <li key={account.id} className="font-medium">
              {account.firstName} {account.lastName}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
