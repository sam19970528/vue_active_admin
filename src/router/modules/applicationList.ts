export default {
    path: "application-list",
    name: "application-list",
    component: () => import("@/views/ApplicationList/index.vue"),
    meta: {
        locale: "申请列表",
        requiresAuth: true,
        icon: "icon-list",
    },
};
