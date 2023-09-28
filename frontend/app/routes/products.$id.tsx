import { redirect, json } from "@remix-run/node";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { type Product } from "~/common/types";
import useAuth from "~/hooks/useAuth";
import iPhone from "../../public/images/iPhone.png";

export const action: ActionFunction = async ({ request }) => {
  const id = request.url.split("/").pop();
  const response = await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return new Response("Something went wrong", {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return redirect("/products");
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const response = await fetch(
    `http://localhost:8080/api/products/${params.id}`
  );

  if (response.status === 404) {
    return new Response("No product found", {
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

  return json(await response.json());
};

export default function ProductsID() {
  const { id } = useParams();
  const product: Product = useLoaderData<typeof loader>();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth() as any;
  const { editCart, cart } = useAuth();

  return (
    <div className="flex gap-12 ml-20 pb-12">
      <div className="h-[36rem] rounded-sm">
        <img src={iPhone} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col p-4 w-2/5 max-h-[22rem] rounded-sm border border-black/80">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-4xl">{product.title}</h2>
          <div>
            {user && `${user.id}` === `${product.accountId}` && (
              <>
                <button
                  onClick={() => setShowModal((s) => !s)}
                  onBlur={() => setShowModal(false)}
                  className="pr-1 font-medium text-primary hover:underline transition-all duration-200"
                >
                  Edit
                </button>
                <AnimatePresence>
                  {showModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ ease: "easeInOut", duration: 0.2 }}
                    >
                      <Form
                        method="DELETE"
                        action={`/products/${id}`}
                        className="flex flex-col gap-8"
                      >
                        <div className="flex justify-center text-black/80 text-lg">
                          <button
                            type="submit"
                            className="bg-primary px-16 py-3 rounded-full hover:bg-primary transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
            <p>{product.price},-</p>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h3 className="font-medium">Description</h3>
          <p className="">{product.description}</p>
        </div>
        <div className="mt-auto">
          {cart && (
            <p className="font-light text-sm">
              You have{" "}
              {cart.products.filter((p: Product) => p.id === product.id).length}{" "}
              {product.title}'s in your cart.
            </p>
          )}
          <button
            className="font-medium mt-2 text-lg w-full flex justify-center py-3 rounded-sm
                      bg-primary text-white hover:bg-accent transition-colors duration-200"
            onClick={() => editCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
