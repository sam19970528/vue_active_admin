<template>
    <div class="navbar">
        <div class="left-side"></div>
        <ul class="right-side">
            <li>
                <a-dropdown trigger="click">
                    <a-avatar :size="46" :style="{ backgroundColor: '#14a9f8' }">{{ userStore.userName }}</a-avatar>
                    <template #content>
                        <a-doption>
                            <a-space @click="logout">
                                <icon-export />
                                <span>退出登入</span>
                            </a-space>
                        </a-doption>
                    </template>
                </a-dropdown>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
export default {
    name: "Navbar",
};
</script>
<script setup lang="ts">
import { useUserStore } from "@/store";
const userStore = useUserStore();
const { logout } = userStore;
</script>
<style scoped lang="less">
.navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
    width: calc(100% - 250px);
}

.left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
}

.right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
        border-radius: 20px;
    }
    li {
        display: flex;
        align-items: center;
        padding: 0 10px;
    }

    a {
        color: var(--color-text-1);
        text-decoration: none;
    }
    .nav-btn {
        border-color: rgb(var(--gray-2));
        color: rgb(var(--gray-8));
        font-size: 16px;
    }
    .trigger-btn,
    .ref-btn {
        position: absolute;
        bottom: 14px;
    }
    .trigger-btn {
        margin-left: 14px;
    }
}
</style>

<style lang="less">
.message-popover {
    .arco-popover-content {
        margin-top: 0;
    }
}
.arco-dropdown-list-wrapper {
    max-height: 100vh !important;
}
</style>
