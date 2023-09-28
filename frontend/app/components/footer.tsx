import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="flex justify-between gap-40 border-t border-white/50 py-12 px-8">
      <div className="flex flex-1 gap-20 pr-20">
        <ul className="flex flex-col gap-4">
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
        <ul className="flex flex-col gap-4">
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </div>
      <div className="flex items-end text-xs font-light">
        All Rights Reserved
      </div>
    </footer>
  );
}
