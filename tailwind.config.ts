import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FBF7EE",
          deep: "#F4EDDC",
          line: "#E7DCC2",
        },
        kingdom: {
          green: "#123A2C",
          "green-light": "#1F5C43",
          "green-pale": "#E5EDE7",
        },
        gold: {
          DEFAULT: "#B8892B",
          light: "#E3C377",
          dim: "#9C7423",
        },
        rust: {
          DEFAULT: "#A85327",
          light: "#C97A4A",
        },
        ink: {
          DEFAULT: "#241E15",
          soft: "#57503F",
          faint: "#8A8171",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "grain-line":
          "repeating-linear-gradient(0deg, rgba(184,137,43,0.06) 0px, rgba(184,137,43,0.06) 1px, transparent 1px, transparent 3px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "spin-slow": "spin-slow 60s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
