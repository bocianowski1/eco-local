import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#63DE72",
        // accent: "#62D370",
        primary: "#3b82f6",
        accent: "#60a5fa",
      },
    },
  },
  plugins: [],
} satisfies Config;
