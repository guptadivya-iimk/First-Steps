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
        bg: {
          DEFAULT: "#F6F7F4",
          card: "#FFFFFF",
        },
        text: {
          main: "#17262A",
          muted: "#55656A",
        },
        border: {
          DEFAULT: "#C9D3D1",
          light: "#E1E6E4",
        },
        teal: {
          primary: "#0E5E5A",
          hover: "#0A4744",
          tint: "#E3F0EE",
          text: "#0B4F4B",
        },
        amber: {
          tint: "#FDF1DC",
          text: "#7A4A00",
        },
        blue: {
          tint: "#E6EEF9",
          text: "#1D4F91",
        },
        purple: {
          tint: "#F1EEF8",
          text: "#4B3A86",
        },
      },
      fontFamily: {
        heading: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "14px",
        chip: "18px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 38, 42, 0.08)",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
export default config;
