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
                background: "#FAFAFA", // Zinc 50
                foreground: "#18181B", // Zinc 900
                surface: "#FFFFFF",
                primary: {
                    DEFAULT: "#18181B", // Black for primary actions (Minimalist)
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#F4F4F5", // Zinc 100
                    foreground: "#18181B",
                },
                muted: {
                    DEFAULT: "#71717A", // Zinc 500
                    foreground: "#A1A1AA",
                },
                accent: {
                    DEFAULT: "#2563EB", // Blue 600
                    foreground: "#FFFFFF",
                },
                border: "#E4E4E7", // Zinc 200
            },
            fontFamily: {
                sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
                display: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
            },
            boxShadow: {
                soft: "0 2px 10px rgba(0, 0, 0, 0.03)",
                hover: "0 10px 30px rgba(0, 0, 0, 0.06)",
            },
            borderRadius: {
                xl: "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
        },
    },
    plugins: [],
};
export default config;
