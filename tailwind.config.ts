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
                // Soft Minimalist Palette
                primary: "#8ECAE6", // Soft Sky Blue
                secondary: "#FFB5A7", // Soft Peach/Coral
                accent: "#FCD5CE", // Pale Pink
                muted: "#9CA3AF", // Soft Gray
                surface: "#FFFFFF", // Pure White Card Background
                "soft-bg": "#F8F9FA", // Off-white Background
            },
            borderRadius: {
                lg: "1rem",
                xl: "1.5rem",
                "2xl": "2rem",
                "3xl": "3rem",
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
                display: ["var(--font-sans)"],
            },
            boxShadow: {
                soft: "0 4px 20px -2px rgba(0, 0, 0, 0.1)",
                "soft-hover": "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
            },
        },
    },
    plugins: [],
};
export default config;
