import type { Config } from "tailwindcss"

const config: Config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "rgb(239 68 68)",
					foreground: "rgb(255 255 255)",
				},
				secondary: {
					DEFAULT: "rgb(113 113 122)",
					foreground: "rgb(255 255 255)",
				},
				destructive: {
					DEFAULT: "rgb(239 68 68)",
					foreground: "rgb(255 255 255)",
				},
				muted: {
					DEFAULT: "rgb(63 63 70)",
					foreground: "rgb(161 161 170)",
				},
				accent: {
					DEFAULT: "rgb(63 63 70)",
					foreground: "rgb(255 255 255)",
				},
				popover: {
					DEFAULT: "rgb(39 39 42)",
					foreground: "rgb(255 255 255)",
				},
				card: {
					DEFAULT: "rgb(39 39 42)",
					foreground: "rgb(255 255 255)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
