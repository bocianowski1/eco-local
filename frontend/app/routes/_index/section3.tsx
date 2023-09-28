import { Link } from "@remix-run/react";
import { styles } from "~/common/styles";

export default function Section3() {
  return (
    <section
      id="3"
      className="relative flex flex-col gap-20 items-center mt-12 pt-32 pb-64"
    >
      <div className="flex flex-col gap-2 items-center font-bold text-6xl">
        <p className="hover:text-black/80 group hover:-translate-y-1 transition-all duration-300">
          Get{" "}
          <span className="text-primary group-hover:text-accent transition-colors duration-300">
            Inspired
          </span>
        </p>
        <p className="hover:text-black/80 group hover:-translate-y-1 transition-all duration-300">
          by the{" "}
          <span className="text-primary group-hover:text-accent transition-colors duration-300">
            Endless
          </span>
        </p>
        <p className="hover:text-black/80 group hover:-translate-y-1 transition-all duration-300">
          <span className="text-primary group-hover:text-accent transition-colors duration-300">
            Possibilites
          </span>{" "}
          Today
        </p>
      </div>
      <div>
        <Link to="/products" className={styles.submitButtonLarge}>
          Get started
        </Link>
      </div>
    </section>
  );
}
