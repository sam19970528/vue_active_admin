<template>
    <a-layout-content class="content">
        <a-form :model="data" :style="{ width: '800px' }">
            <a-form-item v-for="item in data" :field="item.id" :label="item.label" :class="{ 'd-none': item.id === 'FrontEndLogoImgPath' }">
                <a-input size="large" v-model="item.prop" :style="{ width: item.width }">
                    <template v-if="item.append" #append>{{ item.append }}</template>
                </a-input>
            </a-form-item>
            <a-form-item label="首页Logo(268x78)">
                <Upload :logo-item="logoProp()" />
            </a-form-item>
            <a-form-item>
                <a-button html-type="submit" type="primary" size="large" @click="updateSetting">保存</a-button>
            </a-form-item>
        </a-form>
    </a-layout-content>
</template>

<script setup lang="ts">
import { getSysConfigInfo, sysConfigUpdate } from "@/api/module/sysConfig";
import type { SettingItem, ResBodyItem } from "./types";
import { find } from "lodash";
import { Message } from "@arco-design/web-vue";
import { useNotify } from "@/hooks/notify";
import Upload from "@/components/Upload.vue";

onMounted(() => {
    getConfig();
});
const { getAlertUnauditedMsgDuration, clearNotifyInterval } = useNotify();
const data = ref<SettingItem[]>([]);
async function getConfig() {
    const { body, status, msg } = await getSysConfigInfo();
    if (status === "ok") {
        data.value = setDataProp(body);
    } else Message.error(msg);
}
const settingProps: SettingItem[] = [
    {
        id: "AdminLoginLimit",
        prop: "",
        label: "管理员登入个数",
        width: "20%",
        append: "个",
    },
    {
        id: "AlertUnauditedMsgDuration",
        prop: "",
        label: "每几秒提醒未审核笔数",
        width: "20%",
        append: "秒",
    },
    {
        id: "KeepSubmittedEventDuration",
        prop: "",
        label: "已处理订单保留天数",
        width: "20%",
        append: "天",
    },
    {
        id: "SameIpRequestSecs",
        prop: "",
        label: "同IP提交间隔时间",
        width: "20%",
        append: "秒",
    },
    {
        id: "DownloadAppURL",
        prop: "",
        label: "APP下载地址",
        width: "100%",
    },
    {
        id: "OnlineCustomerServiceURL",
        prop: "",
        label: "在线客服地址",
        width: "100%",
    },
    {
        id: "OpenAccountURL",
        prop: "",
        label: "免费开户地址",
        width: "100%",
    },
    {
        id: "PlaceBetOnMobileURL",
        prop: "",
        label: "手机投注地址",
        width: "100%",
    },
    {
        id: "FrontEndLogoImgPath",
        prop: "",
        label: "LOGO",
        width: "100%",
    },
    {
        id: "IndexUrl",
        prop: "",
        label: "首页地址",
        width: "100%",
    },
    {
        id: "FrontEndUrl",
        prop: "",
        label: "大厅地址",
        width: "100%",
    },
];
function setDataProp(body: ResBodyItem[]) {
    return settingProps.map(item => {
        const currentItem = find(body, i => i.id === item.id);
        item.prop = (currentItem as ResBodyItem).prop;
        return item;
    });
}
const logoProp = (): SettingItem => find(data.value, i => i.id === "FrontEndLogoImgPath") as SettingItem;
async function updateSetting() {
    const dataFormat = data.value.map(item => ({ id: item.id, prop: item.prop }));
    const updateData = {
        sysConfigs: dataFormat,
    };
    const { status, msg } = await sysConfigUpdate(updateData);
    if (status === "ok") {
        Message.success("修改成功");
        await getConfig();
        const AlertUnauditedMsgDuration = find(data.value, i => i.id === "AlertUnauditedMsgDuration")!.prop;
        clearNotifyInterval();
        await getAlertUnauditedMsgDuration(AlertUnauditedMsgDuration);
    } else Message.error(msg);
}
</script>
