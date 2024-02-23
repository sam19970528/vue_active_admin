<template>
    <div class="login-form-wrapper">
        <div class="login-form-title">活动系统管理后台</div>
        <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical">
            <a-form-item field="userName" :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]" :validate-trigger="['change', 'input']" hide-label>
                <a-input v-model="userInfo.userName" :placeholder="$t('login.form.userName.placeholder')">
                    <template #prefix>
                        <icon-user />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="password" :rules="[{ required: true, message: $t('login.form.password.errMsg') }]" :validate-trigger="['change', 'input']" hide-label>
                <a-input-password v-model="userInfo.password" :placeholder="$t('login.form.password.placeholder')" allow-clear>
                    <template #prefix>
                        <icon-lock />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-space :size="16" direction="vertical" style="text-align: center">
                <a-button type="primary" long @click="loginHandle">
                    {{ $t("login.form.login") }}
                </a-button>
            </a-space>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { useUserStore } from "@/store";
import { login } from "@/api/module/admin";
const router = useRouter();
const userStore = useUserStore();
const userInfo = reactive({
    password: "",
    roles: 0,
    userName: "",
});
async function loginHandle() {
    const { body, status, msg } = await login(userInfo);
    if (status === "ok") {
        userStore.token = body;
        userStore.userName = userInfo.userName;
        Message.success({
            content: msg,
            duration: 1000,
            onClose: () => {
                router.push("/");
            },
        });
    } else {
        Message.error(msg);
    }
}
</script>

<style lang="less" scoped>
.login-form {
    &-wrapper {
        width: 320px;
    }

    &-title {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
        margin-bottom: 30px;
        text-align: center;
    }

    &-sub-title {
        color: var(--color-text-3);
        font-size: 16px;
        line-height: 24px;
    }

    &-error-msg {
        height: 32px;
        color: rgb(var(--red-6));
        line-height: 32px;
    }

    &-password-actions {
        display: flex;
        justify-content: space-between;
    }

    &-register-btn {
        color: var(--color-text-3) !important;
    }
}
</style>
