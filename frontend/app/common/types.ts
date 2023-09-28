export type Account = {
  id: number;
  firstName: string;
  lastName: string;
  accountNumber: number;
  balance: number;
  token: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  accountId: number;
};

export type Cart = {
  products: Product[];
};

export type Order = {
  id: number;
  accountId: number;
  productId: number;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};
