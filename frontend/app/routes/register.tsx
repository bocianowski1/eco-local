import { redirect, type ActionFunction } from "@remix-run/node";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { styles } from "~/common/styles";
import type { User } from "~/common/types";
import { RegisterBusinessForm, RegisterUserForm } from "~/components";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  if (
    !body.get("firstName") ||
    !body.get("lastName") ||
    !body.get("email") ||
    !body.get("password")
  ) {
    return new Response("Missing first or last name or email or password", {
      status: 400,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  let response = await fetch("http://localhost:8080/api/users", {
    method: "POST",
    body: JSON.stringify({
      firstName: body.get("firstName"),
      lastName: body.get("lastName"),
      email: body.get("email"),
      password: body.get("password"),
    }),
  });

  if (response.status === 400) {
    const text = await response.text();
    throw new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (response.status !== 201 || !response.ok) {
    throw new Response("Something went wrong", {
      status: response.status,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const user: User = await response.json();

  await fetch("http://localhost:7071/api/verify", {
    method: "POST",
    body: JSON.stringify({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }),
  });

  // if (response.status !== 202) {
  //   throw new Response("Something went wrong", {
  //     status: response.status,
  //     headers: {
  //       "Content-Type": "text/html",
  //     },
  //   });
  // }

  return redirect(`/users/${user.id}?token=${user.token}`);
};

export default function Register() {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    controls.start(isOpen ? "closed" : "open");
  };
  return (
    <div className="mx-16">
      <h1 className="font-bold text-2xl mb-6">Register</h1>
      <div
        className="flex items-center ml-auto gap-2 mb-1 w-fit"
        onClick={toggleMenu}
      >
        <button className={styles.link + " text-sm"} onClick={toggleMenu}>
          Register a Business
        </button>
        <div
          onClick={toggleMenu}
          className={`w-5 h-5 border border-black/80 rounded-md flex items-center justify-center
                        ${isOpen ? "" : "bg-primary"}`}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          >
            <path
              d="M20 50L40 70L80 30"
              fill="transparent"
              stroke={isOpen ? "#3b82f6" : "white"}
              strokeWidth="8"
              strokeLinecap="round"
              className="transition-all duration-300 ease-in-out"
            />
          </motion.svg>
        </div>
      </div>
      <div className="flex flex-row overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            className="min-w-full"
            key="user"
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: {
                x: 0,
              },
              closed: {
                x: "-100%",
              },
            }}
            transition={{ duration: 0.5 }}
          >
            <RegisterUserForm />
          </motion.div>
          <motion.div
            className="min-w-full"
            key="business"
            initial="open"
            animate={isOpen ? "closed" : "open"}
            variants={{
              open: {
                x: "-100%",
              },
              closed: {
                x: 0,
              },
            }}
            transition={{ duration: 0.5 }}
          >
            <RegisterBusinessForm />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
