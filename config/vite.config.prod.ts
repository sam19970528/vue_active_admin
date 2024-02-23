import { mergeConfig } from "vite";
import baseConig from "./vite.config.base";

export default mergeConfig(
    {
        mode: "production",
        server: {
            proxy: {
                "/api": {
                    target: "https://transcenter2.tt289.com/event",
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ""),
                },
            },
        },
    },
    baseConig
);
