export default {
    path: "black-manage",
    name: "black-manage",
    component: () => import("@/views/BlackManage/index.vue"),
    meta: {
        locale: "黑名单管理",
        requiresAuth: true,
        icon: "icon-stop",
    },
};
