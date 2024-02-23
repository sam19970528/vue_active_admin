<template>
    <a-config-provider :locale="locale">
        <a-spin dot :loading="userStore.loading">
            <router-view></router-view>
        </a-spin>
        <global-setting />
    </a-config-provider>
</template>

<script setup lang="ts">
import enUS from "@arco-design/web-vue/es/locale/lang/en-us";
import zhCN from "@arco-design/web-vue/es/locale/lang/zh-cn";
import GlobalSetting from "@/components/global-setting/index.vue";
import useLocale from "@/hooks/locale";
import { useUserStore } from "@/store";
const userStore = useUserStore();

const { currentLocale } = useLocale();
const locale = computed(() => {
    switch (currentLocale.value) {
        case "zh-CN":
            return zhCN;
        case "en-US":
            return enUS;
        default:
            return enUS;
    }
});
</script>
