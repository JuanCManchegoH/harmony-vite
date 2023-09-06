import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			external: ["react", "react-router-dom", "react-router", "react-redux"],
			output: {
				globals: {
					react: "React",
				},
			},
		},
	},
});
