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
        bg: "#F3F9EC",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7FCF2",
          cream: "#FFFBEA",
        },
        line: "#DCEECC",
        green: {
          100: "#EAF6D9",
          200: "#CDEBB0",
          400: "#8FD16A",
          500: "#6CC04A",
          600: "#3F9B2E",
          700: "#2F7A22",
        },
        yellow: {
          300: "#FFD95A",
          400: "#FFC73A",
          500: "#FFB81C",
        },
        blue: {
          200: "#BFE6F7",
          400: "#6CC4F0",
          500: "#3FA7E0",
        },
        brown: {
          400: "#A9703A",
          600: "#7A4B24",
        },
        orange: {
          400: "#F59A3B",
        },
        red: {
          500: "#E5483B",
        },
        cream: {
          50: "#FFFBEA",
          100: "#FAF5E4",
        },
        ink: {
          DEFAULT: "#2F3B1F",
          300: "#A9B596",
          600: "#5B6B45",
          900: "#2F3B1F",
          muted: "#5B6B45",
        },
        siswa: {
          100: "#EAF6D9",
          200: "#CDEBB0",
          500: "#6CC04A",
          600: "#3F9B2E",
          700: "#2F7A22",
        },
        guru: {
          100: "#BFE6F7",
          600: "#3FA7E0",
          700: "#2A82B8",
        },
        status: {
          "online-text": "#3F9B2E",
          "online-bg": "#EAF6D9",
          "last-text": "#7A4B24",
          "last-bg": "#FFFBEA",
          "offline-text": "#5B6B45",
          "offline-bg": "#EAEFE6",
          "invalid-text": "#E5483B",
          "invalid-bg": "#FEECEB",
          "sim-text": "#3FA7E0",
          "sim-bg": "#BFE6F7",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "12px",
        md: "18px",
        lg: "28px",
        xl: "36px",
        pill: "999px",
        card: "28px",
        ctl: "999px",
      },
      boxShadow: {
        card: "0 8px 20px rgba(63, 155, 46, 0.18)",
        "card-hover": "0 14px 28px rgba(63, 155, 46, 0.22)",
        btn: "0 4px 0 #2F7A22, 0 8px 14px rgba(63, 155, 46, 0.25)",
        "btn-yellow": "0 4px 0 #D98F00, 0 8px 14px rgba(255, 184, 28, 0.3)",
        "btn-blue": "0 4px 0 #2A82B8, 0 8px 14px rgba(63, 167, 224, 0.3)",
        float: "0 12px 28px rgba(47, 59, 31, 0.15)",
      },
      fontSize: {
        "2xs": ["10px", "14px"],
      },
    },
  },
  plugins: [],
};

export default config;
