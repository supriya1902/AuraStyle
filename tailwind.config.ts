import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#8B5CF6", // Violet
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#EC4899", // Pink
          foreground: "#FFFFFF",
        },
        accent: {
          violet: "#8B5CF6",
          pink: "#EC4899",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#FFFFFF",
        }
      },
      backgroundImage: {
        "gradient-premium": "linear-gradient(to right, #8B5CF6, #EC4899)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        "premium": "0 10px 30px -10px rgba(139, 92, 246, 0.3)",
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};
export default config;
