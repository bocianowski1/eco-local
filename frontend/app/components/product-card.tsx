import { Link } from "@remix-run/react";
import { type Product } from "~/common/types";
import iPhone from "../../public/images/iphone.png";
import useAuth from "~/hooks/useAuth";
import { kr } from "~/common/utils";

export function ProductCard({ product }: { product: Product }) {
  const { editCart } = useAuth();
  return (
    <div className="relative flex flex-col rounded-sm border border-white/80 group">
      <button
        className="bg-primary absolute top-2 right-2 w-8 h-8 rounded-full z-10
                  text-white font-medium hover:bg-accent transition-all duration-500"
        onClick={() => editCart(product)}
      >
        +
      </button>
      <Link to={`/products/${product.id}`}>
        <div className="w-full h-96">
          <img
            src={iPhone}
            alt="iPhone"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium text-xl group-hover:text-primary transition-colors duration-500">
            {product.title}
          </h3>
          <p className="text-primary">{kr(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}
