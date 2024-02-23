import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        svgLoader({ svgoConfig: {} }),
        AutoImport({
            imports: ["vue"],
            dts: "src/auto-import.d.ts",
        }),
    ],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: resolve(__dirname, "../src"),
            },
            {
                find: "assets",
                replacement: resolve(__dirname, "../src/assets"),
            },
            {
                find: "vue-i18n",
                replacement: "vue-i18n/dist/vue-i18n.cjs.js", // Resolve the i18n warning issue
            },
            {
                find: "vue",
                replacement: "vue/dist/vue.esm-bundler.js", // compile template
            },
        ],
        extensions: [".ts", ".js"],
    },
    server: {
        port: 5555,
    },
    define: {
        "process.env": {},
    },
});
