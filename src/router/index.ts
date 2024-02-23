import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";

import { useUserStore } from "@/store";
import PageLayout from "@/layout/page-layout.vue";
import Login from "./modules/login";
import appRoutes from "./modules";

NProgress.configure({ showSpinner: true }); // NProgress Configuration

const router = createRouter({
    history: createWebHashHistory(""),
    routes: [
        {
            path: "/",
            redirect: "/application-list",
        },
        Login,
        {
            name: "root",
            path: "/",
            component: PageLayout,
            children: appRoutes,
            meta: { requiresAuth: true },
        },
    ],
    scrollBehavior() {
        return { top: 0 };
    },
});
router.beforeEach(async (to, from, next) => {
    const { token } = useUserStore();
    NProgress.start();
    if (to.meta.requiresAuth) {
        if (token) {
            next();
        } else {
            next({ name: "login" });
        }
    } else next();
    NProgress.done();
});

export default router;
