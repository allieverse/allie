import { defineConfig } from "vite";
import voby from "voby-vite";

const config = defineConfig({
	plugins: [
		voby({
			hmr: {
				// HMR-related options
				// @ts-expect-error
				enabled: process.env.NODE_ENV !== "production",
				filter: /[]].(jsx|tsx)$/,
			},
		}),
	],
});

export default config;
