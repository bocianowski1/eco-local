import sky from "../../../public/images/sky.jpg";

export default function Section2({
  scrollToSection,
}: {
  scrollToSection: (section: string, margin?: number) => void;
}) {
  return (
    <section
      id="2"
      className="relative text-black/80 flex flex-col gap-20 items-center py-32"
    >
      <div className="absolute top-0 -left-10 -right-10 -z-10 h-full">
        <img src={sky} alt="bg" className="w-full h-full object-cover" />
      </div>
      <div className="text-primary mt-20 flex flex-col gap-2 items-center font-bold text-6xl">
        <p className="group hover:text-blue-600 hover:-translate-y-1 transition-all duration-300">
          Utilize the{" "}
          <span className="text-black/80 group-hover:text-black transition-colors duration-300">
            Power
          </span>{" "}
          of
        </p>
        <p className="group hover:text-blue-600 hover:-translate-y-1 transition-all duration-300">
          Generative{" "}
          <span className="text-black/80 group-hover:text-black transition-colors duration-300">
            AI
          </span>
        </p>
      </div>
      <button
        onClick={() => scrollToSection("3", 150)}
        className="flex flex-col gap-4 items-center text-black/75 hover:text-black transition-colors duration-300"
      >
        <p className="text-xl font-bold hover:text-black transition-colors duration-300">
          Show me how
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
