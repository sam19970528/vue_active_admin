<template>
    <a-modal :default-visible="true" :title="title" @cancel="handleCancel" @before-ok="beforeOkHandle" :simple="type === 2">
        <a-form :model="form" v-if="type !== 2">
            <a-form-item v-if="type === 0" field="userName" label="帐号名" :rules="requiredRules('帐号名')" :validate-trigger="['change', 'input']">
                <a-input v-model="form.userName" />
            </a-form-item>
            <a-form-item field="password" label="新密码" :rules="requiredRules('新密码')" :validate-trigger="['change', 'input']">
                <a-input type="password" v-model="form.password" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { updateAdminUser, createAdminUser, deleteAdminUser } from "@/api/module/admin";
import { Message } from "@arco-design/web-vue";
import type { UpdateAdminUSerType, DeleteAdminType } from "@/api/module/admin/types";

interface Props {
    type: 0 | 1 | 2; // 0新增 1修改 2删除
    userName?: string;
    data?: {
        username: string;
        password: string;
    };
}

const props = defineProps<Props>();

const form = reactive<UpdateAdminUSerType>({
    enable: true,
    password: "",
    roles: 1,
    userName: props.type === 1 ? (props.userName as string) : "",
});
const emit = defineEmits(["cancel", "getData"]);
const getData = () => emit("getData");
const handleCancel = () => emit("cancel");
const title = computed(() => {
    switch (props.type) {
        case 0: {
            return "新增管理员";
        }
        case 1: {
            return `修改管理員${props.userName}的密碼`;
        }
        case 2: {
            return `確定删除管理員${props.data!.username}嗎?`;
        }
    }
});
const beforeOkHandle = computed(() => (props.type === 2 ? deleteAdminHandle : submit));
async function submit() {
    if (props.type === 0) {
        if (!form.userName) {
            Message.error("帳戶名需必填");
            return false;
        }
    }
    if (!form.password) {
        Message.error("新密码需必填");
        return false;
    }
    const api = props.type === 0 ? createAdminUser : updateAdminUser;
    const { body, msg, status } = await api(form);
    if (status === "ok") {
        Message.success(body);
        getData();
        handleCancel();
    } else {
        Message.error(msg);
        return false;
    }
}
async function deleteAdminHandle() {
    const { password, username } = props.data!;
    const data: DeleteAdminType = {
        password,
        roles: 1,
        userName: username,
    };
    const { body, msg, status } = await deleteAdminUser(data);
    if (status === "ok") {
        Message.success(body);
        getData();
        handleCancel();
    } else {
        Message.error(msg);
        return false;
    }
}
function requiredRules(filed: string) {
    const message = `${filed}需必填`;
    return [{ required: true, message }];
}
</script>
