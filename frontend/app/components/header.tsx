import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useAuth from "~/hooks/useAuth";
import { CartPreview } from ".";
import { styles } from "~/common/styles";

export function Header() {
  const { user, token, cart } = useAuth() as any;
  const [showCart, setShowCart] = useState(false);
  const id = user?.id;
  return (
    <header
      className={`sticky top-0 left-0 right-0 flex justify-between items-center bg-white z-50
                        mb-16 pt-12 pb-6 border-b border-black/80 lg:px-0`}
    >
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{
              type: "spring",
              bounce: 0.25,
              duration: 0.75,
              delay: 0.25,
            }}
            onMouseOver={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
            className="absolute right-0 top-0 h-screen w-1/4 px-8 py-10 z-50 bg-white border-l border-black/80"
          >
            <CartPreview cart={cart} />
          </motion.div>
        )}
      </AnimatePresence>
      <Link to="/">
        <h2 className="font-bold text-4xl mx-8">Simplify Shopify</h2>
      </Link>

      <ul className="flex gap-8 font-medium mx-8">
        <li>
          <Link to="/products" className={styles.link}>
            Products
          </Link>
        </li>
        <li>
          <Link to="/accounts" className={styles.link}>
            Accounts
          </Link>
        </li>
        <li
          className="relative group"
          onMouseEnter={() => setShowCart(true)}
          onMouseLeave={() => setShowCart(false)}
        >
          <div
            onMouseEnter={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
            className="absolute -top-2 -right-6 h-6 w-6 p-[0.5] rounded-full bg-white 
                          border-2 border-black/80 text-sm flex items-center justify-center group-hover:cursor-pointer"
          >
            {cart ? cart.products.length : 0}
          </div>

          <Link to="/cart" className={styles.link}>
            Cart
          </Link>
        </li>
        <li className="ml-12">
          {user ? (
            <Link
              className={styles.submitButton}
              to={`/accounts/${id}?token=${token}`}
            >
              Profile
            </Link>
          ) : (
            <Link to="/login" className={styles.submitButton}>
              Log in
            </Link>
          )}
        </li>
      </ul>
    </header>
  );
}
