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
                foreground: "#09090B", // Zinc 950 (より深い黒)
                surface: "#FFFFFF",
                primary: {
                    DEFAULT: "#09090B",
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#F4F4F5",
                    foreground: "#18181B",
                },
                muted: {
                    DEFAULT: "#71717A",
                    foreground: "#A1A1AA",
                },
                accent: {
                    DEFAULT: "#2563EB",
                    foreground: "#FFFFFF",
                },
                border: "#E4E4E7",
            },
            fontFamily: {
                sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
                display: ["-apple-system", "BlinkMacSystemFont", "Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
            },
            boxShadow: {
                soft: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // よりフラットに
                hover: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // シャープな浮き上がり
            },
            borderRadius: {
                // デフォルトのサイズ感を上書きして全体的にシャープに
                lg: "0.5rem",    // 8px
                xl: "0.75rem",   // 12px
                "2xl": "1rem",   // 16px (以前の32pxから縮小)
                "3xl": "1.5rem", // 24px
                full: "9999px",  // pills用（必要な場合のみ）
            },
        },
    },
    plugins: [],
};
export default config;
