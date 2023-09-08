import { defineConfig } from "vite";
import pluginRewriteAll from "vite-plugin-rewrite-all";

const rewriteSlashToIndexHtml = () => {
	return {
		name: "rewrite-slash-to-index-html",
		apply: "serve",
		enforce: "post",
		configureServer(server) {
			// rewrite / as index.html
			server.middlewares.use("/", (req, _, next) => {
				if (req.url === "/") {
					req.url = "/index.html";
				}
				next();
			});
		},
	};
};

// https://vitejs.dev/config/
export default defineConfig({
	appType: "mpa",
	plugins: [pluginRewriteAll(), rewriteSlashToIndexHtml()],
});
