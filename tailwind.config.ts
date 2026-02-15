import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#000000",
        background: "#FFFFFF",
        foreground: "#000000",
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000"
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#000000"
        },
        accent: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF"
        }
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0.375rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem"
      },
      fontFamily: {
        serif: ['"Noto Serif"', "serif"],
        sans: ['"Noto Serif"', "serif"]
      }
    }
  },
  plugins: []
}

export default config
