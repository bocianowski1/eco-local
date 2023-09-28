import { Link } from "@remix-run/react";
import type { Product } from "~/common/types";
import { uniqueProducts, countProducts, kr } from "~/common/utils";
import useAuth from "~/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import iPhone from "../../public/images/iPhone.png";

export default function Cart() {
  const { cart, editCart, removeEveryInstanceFromCart, totalPrice } = useAuth();

  return (
    <div className="flex gap-12 pb-12">
      <div className="px-8 py-4 rounded-sm border border-black/80 h-fit flex-1 transition-all duration-300">
        <h2 className="font-bold text-3xl border-b border-black/80 pb-4 mb-2">
          Your cart{" "}
          {cart.products.length > 0 ? (
            <>
              (<span className="px-1">{cart.products.length} items</span>)
            </>
          ) : (
            <span>is empty...</span>
          )}
        </h2>
        {(!cart || uniqueProducts(cart).length === 0) && (
          <div className="pt-2">
            <Link className="text-primary hover:underline" to="/products">
              Check out the products page!
            </Link>
          </div>
        )}

        {cart && (
          <section
            style={{
              height: `${uniqueProducts(cart).length * 12}rem`,
            }}
            className="relative flex flex-col justify-end pb-4 transition-all duration-300 z-50 overflow-y-hidden"
          >
            <AnimatePresence>
              {uniqueProducts(cart).map((p: Product) => (
                <motion.div
                  initial={{ opacity: 1, zIndex: 1 }}
                  exit={{ opacity: 0, y: -100, zIndex: -1 }}
                  key={p.id}
                  className="flex justify-between sticky -top-4 gap-4 border-b border-black/80 py-4"
                >
                  <div className="flex gap-4">
                    <div className="h-40 w-40">
                      <img
                        src={iPhone}
                        alt={p.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="font-medium text-xl hover:text-primary transition-colors duration-500">
                        <Link to={`/products/${p.id}`}>{p.title}</Link>
                      </h3>
                      <p className="text-sm font-light">{p.description}</p>
                      <button
                        onClick={() => removeEveryInstanceFromCart(p)}
                        className="mt-auto text-sm font-light hover:text-accent transition-colors duration-300"
                      >
                        Remove all
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-4 py-2 text-xl font-bold"
                        onClick={() => editCart(p, true)}
                      >
                        -
                      </button>
                      <p className="mx-auto">
                        (
                        <span className="px-1">
                          {countProducts(cart, p.id)}
                        </span>
                        )
                      </p>
                      <button
                        className="px-4 py-2 text-xl"
                        onClick={() => editCart(p)}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-primary ml-auto">{kr(p.price)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        )}
      </div>
      {cart.products.length > 0 && (
        <div
          className="px-8 pt-4 pb-6 rounded-sm max-h-[22rem] flex flex-col 
                      border border-black/80 w-1/3 transition-all duration-300"
        >
          <h2 className="font-bold text-3xl border-b border-black/80 pb-4">
            Total
          </h2>
          <section className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between">
              <p className="font-medium">Subtotal</p>
              <p>{kr(totalPrice(cart))}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Delivery</p>
              <p className="pr-2">Free</p>
            </div>
          </section>
          <div className="mt-auto pt-8">
            <div className="flex justify-between font-bold text-lg py-4 border-t border-black/80">
              <p className="">Total (VAT included)</p>
              <p>{kr(totalPrice(cart))}</p>
            </div>
            <Link
              to="/cart/checkout"
              className="font-medium text-lg w-full flex justify-center py-3 rounded-sm
            bg-primary text-white hover:bg-accent transition-colors duration-200"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
