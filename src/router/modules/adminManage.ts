export default {
    path: "admin-manage",
    name: "admin-manage",
    component: () => import("@/views/AdminManage/index.vue"),
    meta: {
        locale: "管理员管理",
        requiresAuth: true,
        icon: "icon-user-group",
    },
};
