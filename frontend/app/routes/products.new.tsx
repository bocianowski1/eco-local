import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { styles } from "~/common/styles";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const body = await request.formData();

  if (!body.get("title") || !body.get("description") || !body.get("price")) {
    return new Response("Missing title, description, or price", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (isNaN(Number(body.get("price")))) {
    return new Response("Price must be a number", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  let accountID;
  try {
    accountID = request.url.split("?accountID")[1].split("=")[1];
  } catch {
    return new Response("Missing accountID", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const response = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    body: JSON.stringify({
      title: body.get("title"),
      description: body.get("description"),
      price: Number(body.get("price")),
      accountID: Number(accountID),
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

  return redirect("/products");
};

export default function NewProduct() {
  const [accountID, setAccountID] = useState("");
  useEffect(() => {
    const account = localStorage.getItem("user");
    if (account) {
      const parsedAccount = JSON.parse(account);
      setAccountID(parsedAccount.id);
    }
  }, []);

  return (
    <div>
      <div className="w-80 mx-auto mt-24">
        <h1 className="font-bold text-2xl mb-6">New Product</h1>
        <Form
          action={`/products/new?${new URLSearchParams({
            accountID,
          })}`}
          method="POST"
          className="flex flex-col gap-8 text-black"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const submit = document.getElementById("submit");
              if (submit) {
                submit.click();
              }
            }
          }}
        >
          <input
            required
            type="text"
            className="px-3 py-2 rounded-sm border-2 focus:border-primary focus:outline-none focus:ring-0"
            name="title"
            placeholder="Title..."
          />
          <input
            required
            type="text"
            className="px-3 py-2 rounded-sm border-2 focus:border-primary focus:outline-none focus:ring-0"
            name="price"
            placeholder="Price..."
          />
          <textarea
            required
            rows={3}
            className="px-3 py-2 rounded-sm overflow-scroll outline-none border-2 focus:border-primary focus:outline-none focus:ring-0"
            name="description"
            placeholder="Description..."
          />
          <div className="flex justify-center text-white/80 text-lg">
            <button
              id="submit"
              type="submit"
              className={styles.submitButtonLarge}
            >
              Create
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
