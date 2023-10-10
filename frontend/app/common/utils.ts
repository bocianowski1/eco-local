import type { Cart, Product } from "./types";

export const countProducts = (cart: Cart, id: number) => {
  return cart.products.filter((p: Product) => p.id === id).length;
};

export const uniqueProducts = (cart: Cart) => {
  const unique = cart.products.filter(
    (product: Product, index: number, self: Product[]) =>
      index === self.findIndex((p: Product) => p.id === product.id)
  );

  return unique;
};

export const kr = (price: number) => {
  return price
    .toLocaleString("no-NB", {
      style: "currency",
      currency: "NOK",
    })
    .split(",")[0];
};

export const verifyEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
