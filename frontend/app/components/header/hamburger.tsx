import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "@remix-run/react";
import { styles } from "~/common/styles";
import useAuth from "~/hooks/useAuth";

const menuItems = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Products",
    url: "/products",
  },
  {
    name: "Users",
    url: "/users",
  },
];

const HamburgerMenu: React.FC = () => {
  const { user, token } = useAuth() as any;
  const id = user?.id;

  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    controls.start(isOpen ? "closed" : "open");
  };

  return (
    <div className="">
      <button className="w-14 h-8 relative" onClick={toggleMenu}>
        <motion.div
          className="absolute top-1/2 left-1/2 w-[3px] h-1 bg-black rounded-full"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: {
              height: "100%",
              rotate: 45,
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            },
            closed: {
              height: "100%",
              rotate: 90,
              top: "25%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            },
          }}
          transition={{ duration: 0.25 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[3px] h-1 bg-black rounded-full"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: {
              height: 0,
            },
            closed: {
              height: "100%",
              rotate: 90,
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            },
          }}
          transition={{ duration: 0.25 }}
        />
        <motion.div
          className="absolute bottom-1/2 left-1/2 w-[3px] h-1 bg-black rounded-full"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: {
              height: "100%",
              rotate: -45,
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            },
            closed: {
              height: "100%",
              rotate: -90,
              top: "75%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            },
          }}
          transition={{ duration: 0.25 }}
        />
      </button>
      <motion.div
        className={`fixed top-24 right-0 w-full h-screen bg-white p-4 transform ${
          isOpen ? "translate-y-0" : "translate-y-full transition-all"
        }`}
        initial="closed"
        animate={controls}
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
      >
        <motion.ul
          className="text-white flex flex-col gap-2"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: {
              opacity: 1,
              transition: {
                delay: 0.1,
                staggerChildren: 0.2,
              },
            },
            closed: {
              opacity: 0,
            },
          }}
        >
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              variants={{
                open: { opacity: 1 },
                closed: { opacity: 0 },
              }}
            >
              <Link
                to={item.url}
                className={styles.link}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            </motion.li>
          ))}
          <motion.li
            onClick={() => {
              setIsOpen(false);
              localStorage.clear();
            }}
            variants={{
              open: { opacity: 1 },
              closed: { opacity: 0 },
            }}
          >
            {user ? (
              <Link className={styles.link} to={`/users/${id}?token=${token}`}>
                Profile
              </Link>
            ) : (
              <Link to="/login" className={styles.link}>
                Log in
              </Link>
            )}
          </motion.li>
        </motion.ul>
      </motion.div>
    </div>
  );
};

export default HamburgerMenu;
