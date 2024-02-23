import { useUserStore } from "@/store";
import { Notification } from "@arco-design/web-vue";
import { getSysConfigInfo } from "@/api/module/sysConfig";
import { find } from "lodash";
import { Message } from "@arco-design/web-vue";
import { unauditedSubmittedEventCount } from "@/api/module/test";

export function useNotify() {
    const userStore = useUserStore();

    async function getAlertUnauditedMsgDuration(value?: string) {
        if (value) {
            createNotify(value);
        } else {
            const { body, status, msg } = await getSysConfigInfo();
            if (status === "ok") {
                const result = find(body, i => i.id === "AlertUnauditedMsgDuration").prop;
                createNotify(result);
            } else Message.error(msg);
        }
    }
    async function createNotify(second: string) {
        const count = await getUnConfirmOrderCount();
        if (!second || count === 0) return;
        const formatSecond = Number(second);
        const intervalNum = window.setInterval(() => {
            Notification.info(`待审核活动共${count}笔`);
        }, formatSecond * 1000);
        userStore.notificationIntervalNum = intervalNum;
    }
    async function getUnConfirmOrderCount() {
        const count: unknown = await unauditedSubmittedEventCount();
        return count as number;
    }
    const clearNotifyInterval = () => clearInterval(userStore.notificationIntervalNum);
    return {
        getAlertUnauditedMsgDuration,
        clearNotifyInterval,
    };
}
