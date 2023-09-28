import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { type Product } from "~/common/types";
import { ProductCard } from "~/components";

export const loader = async () => {
  const res = await fetch("http://localhost:8080/api/products");
  return json(await res.json());
};

export default function Products() {
  const products = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="font-bold text-4xl">Products</h1>
      <div className="flex flex-col gap-8 pb-2">
        <p className="font-thin">{products.length} products</p>
        <Link to="/products/new" className="text-primary hover:underline">
          Create a new product
        </Link>
      </div>
      {!products ||
        (products.length === 0 && (
          <div>
            <p className="">No products found.</p>
          </div>
        ))}
      <ul className="grid grid-cols-4 gap-8 pb-12">
        {products &&
          products.map((product: Product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
      </ul>
    </div>
  );
}
