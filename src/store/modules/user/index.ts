import { defineStore } from "pinia";
import { useNotify } from "@/hooks/notify";
import router from "@/router";

const useUserStore = defineStore(
    "user",
    () => {
        const loading = ref(false);
        const token = ref("");
        const userName = ref("");
        const notificationIntervalNum = ref<number>(0);
        const { clearNotifyInterval } = useNotify();
        function logout() {
            token.value = "";
            userName.value = "";
            clearNotifyInterval();
            router.push("/login");
        }
        return {
            loading,
            token,
            notificationIntervalNum,
            logout,
            userName,
        };
    },
    {
        persist: {
            paths: ["token", "userName"],
        },
    }
);
export default useUserStore;
