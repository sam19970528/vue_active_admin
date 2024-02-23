<template>
    <a-layout-content class="content">
        <div style="margin-bottom: 10px">
            <a-button type="primary" size="large" @click="modalShow = true">
                <template #icon>
                    <icon-plus />
                </template>
                新增黑名单
            </a-button>
        </div>
        <div style="margin-bottom: 10px">
            <a-input-search size="large" :style="{ width: '260px' }" placeholder="请输入IP" v-model="searchIP" search-button @search="searchBlackIP" />
        </div>
        <a-table :columns="columns" :data="data" :pagination="paginationProps" size="medium">
            <template #createDate="{ record }">
                {{ moment(record.createDate).format("YYYY-MM-DD hh:mm:ss") }}
            </template>
            <template #handle="{ record }">
                <a-button type="primary" status="danger" @click="deleteBlackIP(record.blackIP)">
                    <template #icon>
                        <icon-delete />
                    </template>
                    <template #default>删除</template>
                </a-button>
            </template>
        </a-table>
        <Modal v-if="modalShow === true" @cancel="cancelHandler" @getData="getBlackList" />
    </a-layout-content>
</template>

<script setup lang="ts">
import { Message, PaginationProps, TableColumnData } from "@arco-design/web-vue";
import { getAllBlackList, deleteBlackItem, searchBlackList } from "@/api/module/admin";
import Modal from "./Modal/index.vue";
import moment from "moment";

onMounted(() => {
    getBlackList();
});
const modalShow = ref<boolean | number>(false);

const paginationProps = reactive<PaginationProps>({
    showTotal: true,
    pageSize: 10,
    total: 0,
});
const data = ref([]);
const searchIP = ref("");
async function getBlackList() {
    const { body, status } = await getAllBlackList();
    if (status === "ok") {
        data.value = body;
        paginationProps.total = data.value.length;
    }
}
const cancelHandler = () => (modalShow.value = false);
const columns: TableColumnData[] = [
    {
        title: "IP",
        dataIndex: "blackIP",
    },
    {
        title: "创建日期",
        dataIndex: "createDate",
        slotName: "createDate",
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
async function deleteBlackIP(ip: string) {
    const params = { ip };
    const { body, status } = await deleteBlackItem(params);
    if (status === "ok") {
        Message.success(body);
        await getBlackList();
    }
}
async function searchBlackIP() {
    const params = { ip: searchIP.value };
    if (!searchIP.value) {
        await getBlackList();
        return;
    }
    const { body, status, msg } = await searchBlackList(params);
    if (status === "ok") {
        Message.success(msg);
        data.value = body;
    }
}
</script>

<style scoped>
.arco-table {
    width: 50%;
}
</style>
