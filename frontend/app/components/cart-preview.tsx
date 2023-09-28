import { Link } from "@remix-run/react";
import { styles } from "~/common/styles";
import type { Cart, Product } from "~/common/types";
import { countProducts, uniqueProducts } from "~/common/utils";

export function CartPreview({ cart }: { cart: Cart }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Link
          to="/cart"
          className="hover:text-primary transition-all duration-200"
        >
          <h2 className="font-bold text-xl pt-4 pb-3">Cart</h2>
        </Link>
        {cart.products.length === 0 && (
          <p className="text-black/80">Your cart is empty</p>
        )}
      </div>
      {cart.products.length > 0 && (
        <div className="flex flex-col gap-4 py-4 mb-1 border-y border-black/80">
          {uniqueProducts(cart).map((p: Product) => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              className="flex justify-between hover:text-accent hover:underline transition-all duration-200"
            >
              <h3 className="font-medium">{p.title}</h3>
              <p>({countProducts(cart, p.id)})</p>
            </Link>
          ))}
        </div>
      )}
      {cart.products.length > 0 && (
        <div className="flex justify-between py-4">
          <Link to="/cart/checkout" className={styles.link}>
            Checkout
          </Link>
          <Link to="/cart" className={styles.link}>
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
}
