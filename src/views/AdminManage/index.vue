<template>
    <a-layout-content class="content">
        <div style="margin-bottom: 10px">
            <a-button type="primary" size="large" @click="modalShow = true">
                <template #icon>
                    <icon-plus />
                </template>
                新增管理员
            </a-button>
        </div>
        <a-table :columns="columns" :data="data" :pagination="paginationProps">
            <template #lastLoginTime="{ record }">
                {{ moment(record.lastLoginTime).format("YYYY-MM-DD hh:mm:ss") }}
            </template>
            <template #handle="{ record }">
                <a-button type="primary" style="margin-right: 5px" @click="modalShowHandle(record.username, 1)">
                    <template #icon>
                        <icon-edit />
                    </template>
                    <template #default>修改密码</template>
                </a-button>
                <a-button type="primary" status="danger" @click="modalShowHandle(record.username, 2)">
                    <template #icon>
                        <icon-delete />
                    </template>
                    <template #default>删除</template>
                </a-button>
                <Modal v-if="modalShow === record.username && currentShowType === 1" @cancel="cancelHandler" @getData="getAdminList" :userName="record.username" :type="1" />
                <Modal v-if="modalShow === record.username && currentShowType === 2" @cancel="cancelHandler" @getData="getAdminList" :data="record" :type="2" />
            </template>
        </a-table>
        <Modal v-if="modalShow === true" @cancel="cancelHandler" @getData="getAdminList" :type="0" />
    </a-layout-content>
</template>

<script setup lang="ts">
import { listAllAdminUser } from "@/api/module/admin";
import type { PaginationProps, TableColumnData } from "@arco-design/web-vue";
import Modal from "./Modal/index.vue";
import moment from "moment";

onMounted(() => {
    getAdminList();
});
const modalShow = ref<boolean | string>(false);
const data = ref([]);
async function getAdminList() {
    const { body, status } = await listAllAdminUser();
    if (status === "ok") {
        data.value = body;
        paginationProps.total = data.value.length;
    }
}
const paginationProps = reactive<PaginationProps>({
    showTotal: true,
    pageSize: 10,
    total: 0,
});
const cancelHandler = () => {
    modalShow.value = false;
    currentShowType.value = null;
};
const currentShowType = ref<ShowType>(null);
type ShowType = 1 | 2 | null;
const modalShowHandle = (username: string, type: ShowType) => {
    modalShow.value = username;
    currentShowType.value = type;
};
const columns: TableColumnData[] = [
    {
        title: "帐号名",
        dataIndex: "username",
    },
    {
        title: "上次登入IP",
        dataIndex: "lastLoginIP",
    },
    {
        title: "上次登入时间",
        dataIndex: "lastLoginTime",
        slotName: "lastLoginTime",
        sortable: {
            sortDirections: ["ascend", "descend"],
        },
    },
    {
        title: "操作",
        dataIndex: "handle",
        slotName: "handle",
    },
];
</script>
