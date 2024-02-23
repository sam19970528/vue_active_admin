export default {
    path: "active-manage",
    name: "active-manage",
    component: () => import("@/views/ActiveManage/index.vue"),
    meta: {
        locale: "活动管理",
        requiresAuth: true,
        icon: "icon-tag",
    },
};
