export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  premium: boolean;
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

export type HTTPError = {
  status: number;
  statusText: string;
  internal?: boolean;
  data?: string;
};
