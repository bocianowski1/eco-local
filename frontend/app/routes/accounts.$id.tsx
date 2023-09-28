import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { styles } from "~/common/styles";
import type { Product } from "~/common/types";
import useAuth from "~/hooks/useAuth";

export const action: ActionFunction = async () => {
  return redirect("/");
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const token = request.url.split("?token=")[1];
  if (!token) {
    return redirect(`/accounts?token=${token}`);
  }
  let response = await fetch(
    `http://localhost:8080/api/accounts/${params.id}`,
    {
      headers: {
        "x-jwt-token": token,
      },
    }
  );

  if (response.status !== 200) {
    redirect("/accounts");
  }

  if (response.status === 404) {
    return new Response("No account found", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (response.status === 500) {
    return new Response("Something went wrong", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const account = await response.json();

  response = await fetch(
    `http://localhost:8080/api/accounts/${params.id}/products`,
    {
      headers: {
        "x-jwt-token": token,
      },
    }
  );

  if (response.status !== 200) {
    redirect("/accounts");
  }

  if (response.status === 404) {
    return new Response("No account found", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (response.status === 500) {
    return new Response("Something went wrong", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const products = await response.json();

  return json({ account, products });
};

export default function AccountsID() {
  const { account, products } = useLoaderData<typeof loader>();
  const [showSettings, setShowSettings] = useState(false);
  const { setUser, setToken, signOut } = useAuth();

  useEffect(() => {
    setUser(account);
    setToken(account.token);
    localStorage.setItem("user", JSON.stringify(account));
    localStorage.setItem("token", account.token);
  }, [account, setUser, setToken]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-8 w-full">
        <section className="flex justify-between">
          <h1 className="font-bold text-4xl">
            {account.firstName} {account.lastName}
          </h1>
          <button
            className="bg-primary font-medium rounded-sm text-white px-6 py-3 hover:bg-accent transition-colors duration-200"
            onClick={() => setShowSettings((s) => !s)}
          >
            Settings
          </button>
        </section>
        <section className="">
          <h3 className="font-bold text-2xl">Your products</h3>
          {products && products.length > 0 ? (
            <div>
              <ul>
                {products.map((product: Product) => (
                  <li key={product.id}>{product.title}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p>You have no products :(</p>
              <Link to="/products/new" className={styles.link}>
                Create a new product!
              </Link>
            </div>
          )}
        </section>
      </div>
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{
              type: "spring",
              bounce: 0.25,
              duration: 0.75,
            }}
            className="absolute right-0 top-0 h-screen w-1/3 px-8 py-10 z-50 bg-white border-l border-black/80"
            onMouseLeave={() => setShowSettings(false)}
          >
            <div className="flex flex-col items-start gap-4">
              <Form action={`/accounts/${account.id}`} method="POST">
                <button onClick={signOut}>Sign out</button>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
