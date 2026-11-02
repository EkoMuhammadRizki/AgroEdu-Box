import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5F8F5",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7FAF8",
        },
        line: "#DCE5DF",
        ink: {
          DEFAULT: "#17352A",
          muted: "#5F7068",
        },
        siswa: {
          100: "#E5F2E9",
          500: "#4FA36B",
          600: "#166A43",
          700: "#0F5434",
        },
        guru: {
          100: "#E6EEFF",
          600: "#1F55B8",
          700: "#184493",
        },
        status: {
          "online-text": "#166A43",
          "online-bg": "#E5F2E9",
          "last-text": "#8A5A00",
          "last-bg": "#FFF4D6",
          "offline-text": "#6B7280",
          "offline-bg": "#EEF0F2",
          "invalid-text": "#B42318",
          "invalid-bg": "#FDECEA",
          "sim-text": "#6941C6",
          "sim-bg": "#F1EBFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        ctl: "12px",
      },
      fontSize: {
        "2xs": ["10px", "14px"],
      },
    },
  },
  plugins: [],
};

export default config;
