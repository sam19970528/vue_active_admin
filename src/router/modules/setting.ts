export default {
    path: "setting",
    name: "setting",
    component: () => import("@/views/setting/index.vue"),
    meta: {
        locale: "设置",
        requiresAuth: true,
        icon: "icon-settings",
    },
};
