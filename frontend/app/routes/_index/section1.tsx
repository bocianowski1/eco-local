import { motion } from "framer-motion";

export default function Section1({
  scrollToSection,
}: {
  scrollToSection: (section: string, margin?: number) => void;
}) {
  return (
    <section className="flex flex-col gap-28 items-center py-36">
      <motion.div
        initial={{ scale: 0.75 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 items-center font-bold text-6xl"
      >
        <p className="hover:text-black group hover:-translate-y-1 transition-all duration-300">
          Explore the{" "}
          <span className="text-primary group-hover:text-accent transition-colors duration-300">
            World
          </span>
        </p>
        <p className="hover:text-black group hover:-translate-y-1 transition-all duration-300">
          of{" "}
          <span className="text-primary group-hover:text-accent transition-colors duration-300">
            Undiscovered
          </span>
        </p>
        <p className="hover:text-black group hover:-translate-y-1 transition-all duration-300">
          <span className="text-primary group-hover:text-accent transition-colors duration-300">
            Best
          </span>{" "}
          Sellers
        </p>
      </motion.div>
      <button
        onClick={() => scrollToSection("2", 180)}
        className="flex flex-col gap-4 items-center text-black/80 hover:text-black transition-colors duration-300"
      >
        <p className="text-xl font-bold hover:text-black transition-colors duration-300">
          Read more
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-8 animate-bounce hover:text-black transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </section>
  );
}
