import { mergeConfig } from "vite";
import baseConig from "./vite.config.base";

export default mergeConfig(
    {
        mode: "development",
        server: {
            open: true,
            fs: {
                strict: true,
            },
            host: true,
            proxy: {
                "/api": {
                    target: "http://192.168.0.126:9090",
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ""),
                },
            },
        },
        plugins: [],
    },
    baseConig
);
