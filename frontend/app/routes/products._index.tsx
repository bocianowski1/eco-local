import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { styles } from "~/common/styles";
import { type Product } from "~/common/types";
import { ProductCard } from "~/components";

export const loader = async () => {
  const res = await fetch("http://localhost:8080/api/products");
  return json(await res.json());
};

export default function Products() {
  const allProducts = useLoaderData<typeof loader>();
  const [products, setProducts] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterProducts(event.target.value);
  };

  const filterProducts = (term: string) => {
    if (!term) {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter((product: Product) =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-4xl">Products</h1>
          <div className="flex flex-col gap-8 pb-2">
            <p className="font-thin">{products.length} products</p>
            <Link to="/products/new" className={styles.link + " w-fit"}>
              Create a new product
            </Link>
          </div>
          {!products ||
            (products.length === 0 && (
              <div>
                <p className="">No products found.</p>
              </div>
            ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-16 pb-12">
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
