import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { type Account } from "~/common/types";
// import useAuth from "~/hooks/useAuth";

export const loader = async () => {
  const res = await fetch("http://localhost:8080/api/accounts");
  return json(await res.json());
};

export default function Accounts() {
  const accounts = useLoaderData<typeof loader>();
  return (
    <main className="px-8">
      <h1 className="font-bold text-4xl ">Accounts</h1>
      <p className="pb-4 font-thin">{accounts.length} accounts</p>
      {!accounts ||
        (accounts.length === 0 && (
          <div>
            <p className="">No accounts found.</p>
            <Link className="text-green-500 hover:underline" to="/login">
              Login
            </Link>
          </div>
        ))}
      {accounts && accounts.length > 0 && (
        <ul>
          {accounts.map((account: Account) => (
            <li key={account.id}>
              {/* <Link to={account.id} className="text-blue-600 underline"> */}
              <div>
                <p>
                  {account.firstName} {account.lastName}
                </p>
              </div>
              {/* </Link> */}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
