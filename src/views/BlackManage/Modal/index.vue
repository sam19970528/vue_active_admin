<template>
    <a-modal :default-visible="true" title="新增IP黑名單" @cancel="handleCancel" @before-ok="submit">
        <a-form :model="form">
            <a-form-item field="ip" label="IP" :rules="requiredRules('IP')" :validate-trigger="['change', 'input']">
                <a-input v-model="form.ip" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { addBlackItem } from "@/api/module/admin";
import { Message } from "@arco-design/web-vue";

const form = reactive({
    ip: "",
});
const emit = defineEmits(["cancel", "getData"]);
const getData = () => emit("getData");
const handleCancel = () => emit("cancel");
async function submit() {
    if (!form.ip) {
        Message.error("IP需必填");
        return false;
    }
    const { body, msg, status } = await addBlackItem(form);
    if (status === "ok") {
        Message.success(body);
        getData();
        handleCancel();
    }
}
function requiredRules(filed: string) {
    const message = `${filed}需必填`;
    return [{ required: true, message }];
}
</script>
