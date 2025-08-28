import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/(app)/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [animate],
};

export default config;
