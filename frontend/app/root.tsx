import type { LinksFunction } from "@remix-run/node";
import stylesheet from "../tailwind.css";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { Header } from "./components/";
import { AuthProvider } from "./hooks/useAuth";
import { styles } from "./common/styles";
import { type HTTPError } from "./common/types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white text-black/80 relative">
        <AuthProvider>
          <Layout>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let error = useRouteError() as HTTPError;
  console.error("ERROR:", error);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Error{" "}
              <span className="font-light text-lg">({error.statusText})</span>
            </h2>
            <div className="flex gap-2">
              <h3>Why?</h3>
              <p>{error.data}</p>
            </div>
            <Link to="/" className={styles.link}>
              Home
            </Link>
          </div>
          <Scripts />
        </Layout>
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="px-8 overflow-hidden">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
