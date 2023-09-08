import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
const pluginRewriteAll = require("vite-plugin-rewrite-all");

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), pluginRewriteAll()],
});
