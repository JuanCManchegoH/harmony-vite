import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
const pluginRewriteAll = () => {
	return {
		name: "rewrite-all",
		transformIndexHtml(html: string) {
			return html.replace(
				'<script type="module" src="/src/main.tsx"></script>',
				'<script type="module" src="/src/main.tsx" data-rewrite-all></script>',
			);
		},
	};
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), pluginRewriteAll()],
});
