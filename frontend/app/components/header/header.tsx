import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useAuth from "~/hooks/useAuth";
import { CartPreview } from "..";
import HamburgerMenu from "./hamburger";
import { styles } from "~/common/styles";
import { CartIcon, UserIcon } from "../icons";

export function Header() {
  const { user, cart, token } = useAuth() as any;
  const [showCart, setShowCart] = useState(false);
  const id = user?.id;

  return (
    <header
      className={`sticky top-0 left-0 right-0 flex justify-between items-center bg-white z-50
                  mb-16 py-6 border-b border-black/80`}
    >
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 10 }}
            exit={{ x: 400 }}
            transition={{
              type: "spring",
              bounce: 0.25,
              duration: 0.75,
              delay: 0.25,
            }}
            onMouseOver={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
            className="absolute right-0 top-0 h-screen w-64 px-8 py-10 z-50 bg-white border-l border-black/80"
          >
            <CartPreview cart={cart} />
          </motion.div>
        )}
      </AnimatePresence>
      <Link to="/">
        <h2 className="font-extrabold text-3xl mx-6">ECOLOCAL</h2>
      </Link>

      <ul className="flex items-center gap-4 font-medium mx-4">
        <li>
          <Link to={user ? `/users/${id}?token=${token}` : "/login"}>
            <UserIcon />
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
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white
                          border-2 border-black/80 text-xs flex items-center justify-center 
                          group-hover:cursor-pointer"
          >
            {cart ? cart.products.length : 0}
          </div>

          <Link to="/cart" className={styles.link}>
            <CartIcon />
          </Link>
        </li>
        <li>
          <HamburgerMenu />
        </li>
      </ul>
    </header>
  );
}
