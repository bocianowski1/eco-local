import { createContext, useState, useContext, useMemo, useEffect } from "react";
import type { Account, Cart, Product } from "../common/types";

const AuthContext = createContext({
  user: null,
  token: "",
  setUser: (user: Account) => {},
  setToken: (token: string) => {},
  editCart: (product: Product, remove?: boolean) => {},
  removeEveryInstanceFromCart: (product: Product) => {},
  totalPrice: (cart: Cart) => {},
  signOut: () => {},
} as any);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Account | null | any>(null);
  const [cart, setCart] = useState<Cart>({
    products: [],
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    const account = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const cartFromLocalStorage = localStorage.getItem("cart");

    if (account && token) {
      setUser(JSON.parse(account));
      setToken(token);
    }

    if (cartFromLocalStorage) {
      setCart(JSON.parse(cartFromLocalStorage));
    }
  }, []);

  const editCart = (product: Product, remove = false) => {
    setTimeout(() => {
      setCart((prevCart: Cart) => {
        if (remove) {
          const index = prevCart.products.findIndex(
            (p: Product) => p.id === product.id
          );

          if (index === -1) {
            return prevCart;
          }

          const newCart = {
            ...prevCart,
            products: [
              ...prevCart.products.slice(0, index),
              ...prevCart.products.slice(index + 1),
            ],
          };

          localStorage.setItem("cart", JSON.stringify(newCart));

          return newCart;
        } else {
          const newCart = {
            ...prevCart,
            products: [...prevCart.products, product],
          };

          localStorage.setItem("cart", JSON.stringify(newCart));
          return newCart;
        }
      });
    }, 100);
  };

  const removeEveryInstanceFromCart = (product: Product) => {
    setCart((prevCart: Cart) => {
      const newCart = {
        ...prevCart,
        products: prevCart.products.filter((p: Product) => p.id !== product.id),
      };

      localStorage.setItem("cart", JSON.stringify(newCart));

      return newCart;
    });
  };

  const totalPrice = (cart: Cart) => {
    let sum = 0;
    cart.products.forEach((p: Product) => {
      sum += p.price;
    });

    return sum;
  };

  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setUser(null);
    setToken("");
    setCart({
      products: [],
    });
  };

  const memo = useMemo(
    () => ({
      user,
      token,
      setUser,
      setToken,
      cart,
      editCart,
      removeEveryInstanceFromCart,
      totalPrice,
      signOut,
    }),
    [user, token, cart]
  );

  return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>;
};

export default function useAuth() {
  return useContext(AuthContext);
}
