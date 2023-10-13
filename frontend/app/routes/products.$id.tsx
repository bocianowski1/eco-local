import { redirect, json } from "@remix-run/node";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { type Product } from "~/common/types";
import useAuth from "~/hooks/useAuth";
import iPhone from "../../public/images/iphone.png";
import { styles } from "~/common/styles";
import { kr } from "~/common/utils";

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

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  let response;
  const userId = request.url.split("?userId=")[1];

  if (userId) {
    try {
      response = await fetch(`http://localhost:8080/api/analytics`, {
        method: "POST",
        body: JSON.stringify({
          productId: Number(params.id),
          userId: Number(userId),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status != 200) {
        console.error("could not report pageview:", response);
      }
    } catch (error) {
      console.error("could not report pageview:", error);
    }
  }

  try {
    response = await fetch(`http://localhost:8080/api/products/${params.id}`);

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

    const product = await response.json();

    return json({ product });
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
};

export default function ProductsID() {
  const { id } = useParams();
  const { product } = useLoaderData<typeof loader>();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth() as any;
  const { editCart, cart } = useAuth();

  return (
    <div className="flex flex-col gap-12 pb-12">
      <div className="h-[26rem] rounded-sm">
        <img src={iPhone} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-4xl">{product.title}</h2>
          <div>
            {user && `${user.id}` === `${product.accountId}` && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal((s) => !s)}
                  onBlur={() => setShowModal(false)}
                  className={styles.link}
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
              </div>
            )}
            <p>{kr(product.price)}</p>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h3 className="font-medium">Description</h3>
          <p className="">{product.description}</p>
        </div>
        <div className="mt-12">
          <section className="flex justify-between items-end pb-2">
            <p className="font-light text-sm">
              You have{" "}
              {cart.products.filter((p: Product) => p.id === product.id).length}{" "}
              {product.title}'s in your cart.
            </p>
            <div className="flex gap-4 items-center pb-2">
              <button
                className="px-3 py-1 bg-primary rounded-full text-white hover:bg-primary/80 transition-colors duration-200"
                onClick={() => editCart(product, true)}
              >
                -
              </button>
              <span className="text-lg">
                {
                  cart.products.filter((p: Product) => p.id === product.id)
                    .length
                }{" "}
              </span>
              <button
                className="px-3 py-1 bg-primary rounded-full text-white hover:bg-primary/80 transition-colors duration-200"
                onClick={() => editCart(product)}
              >
                +
              </button>
            </div>
          </section>
          <section className="flex flex-col gap-2">
            <button
              className={styles.submitButtonLarge}
              onClick={() => editCart(product)}
            >
              Add to cart
            </button>
            <Link
              to="/cart"
              className="bg-white border border-black/80 text-primary text-center font-medium h-fit w-full rounded-sm text-lg px-12 py-3 
                        hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Buy now
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
