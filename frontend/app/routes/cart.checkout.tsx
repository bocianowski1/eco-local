import { Link } from "@remix-run/react";
import { uniqueProducts } from "~/common/utils";
import useAuth from "~/hooks/useAuth";

export default function Checkout() {
  const { cart } = useAuth();
  if (!cart || (cart && cart.products.length === 0)) {
    return <div>No cart</div>;
  }

  return (
    <div className="flex flex-col gap-12 pb-12">
      <div className="px-8 py-4 rounded-sm border border-black/80 h-fit flex-1 transition-all duration-300">
        <h2 className="font-bold text-3xl border-b border-black/80 pb-4 mb-2">
          Payment details
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
            // style={{
            //   height: `${uniqueProducts(cart).length * 12}rem`,
            // }}
            className="relative flex flex-col justify-end pb-4 transition-all duration-300 z-50 overflow-y-hidden"
          ></section>
        )}
      </div>
      {cart.products.length > 0 && (
        <div
          className="px-8 pt-4 pb-6 rounded-sm max-h-[22rem] flex flex-col 
                      border border-black/80 transition-all duration-300"
        >
          <h2 className="font-bold text-3xl border-b border-black/80 pb-4">
            Total
          </h2>
          <section className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between">
              <p className="font-medium">Subtotal</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Delivery</p>
              <p className="pr-2">Free</p>
            </div>
          </section>
          <div className="mt-auto pt-8">
            <div className="flex justify-between font-bold text-lg py-4 border-t border-black/80">
              <p className="">Total (VAT included)</p>
            </div>
            <button
              className="font-medium text-lg w-full flex justify-center py-3 rounded-sm
            bg-primary text-white hover:bg-accent transition-colors duration-200"
            >
              Complete order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
