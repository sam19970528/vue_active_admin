import { defineStore } from "pinia";
import type { AlertStateType, NotifyHandleType } from "./types";

const useComponentStore = defineStore("component", () => {
    const alertShow = ref(false);
    const alertState = reactive<AlertStateType>({
        type: "success",
        text: "",
    });
    async function alertNotifyHandle({ type, text, timeout = 3000 }: NotifyHandleType) {
        alertState.type = type;
        alertState.text = text;
        alertShow.value = true;
        await new Promise<void>(resolve => {
            setTimeout(() => {
                alertShow.value = false;
            }, timeout);
            resolve();
        });
    }
    return {
        alertShow,
        alertNotifyHandle,
        alertState,
    };
});
export default useComponentStore;
