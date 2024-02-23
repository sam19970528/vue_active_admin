<template>
    <a-modal v-model:visible="visible" @cancel="handleCancel" :on-before-ok="ApproveApplication">
        <template #title>{{ title }}</template>
        <a-form :model="form">
            <a-form-item field="note" label="回复信息">
                <a-input v-model="form.note" placeholder="输入回复信息，可留空" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { approveByAdmin } from "@/api/module/submit";
import type { ApproveForm } from "@/api/module/submit/types";
import { transStatus } from "@/lib/format";
import { Message } from "@arco-design/web-vue";

interface Prop {
    item: {
        id: string;
        operator: number;
    };
}
const props = defineProps<Prop>();
const emit = defineEmits(["cancel", "getData"]);
const visible = ref(true);
const form = reactive<ApproveForm>({
    id: props.item.id,
    note: "",
    status: props.item.operator,
});
const title = `确定修改状态为${transStatus(props.item.operator).text}?`;
const updateData = () => emit("getData");
const handleCancel = () => emit("cancel");
async function ApproveApplication() {
    const { body, msg, status } = await approveByAdmin(form);
    if (status === "ok") {
        Message.success(body);
        updateData();
        handleCancel();
    } else {
        Message.error(msg);
        return false;
    }
}
</script>
