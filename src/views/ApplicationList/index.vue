<template>
    <a-layout-content class="content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px">
            <a-tabs type="rounded" v-model:active-key="currentTabStatus" @change="getApplicationListData">
                <a-tab-pane v-for="item in tabPaneList" :key="item.key" :title="item.title"></a-tab-pane>
            </a-tabs>
            <a-input-search size="large" :style="{ width: '260px' }" v-model="searchUser" placeholder="请输入会员名称" search-button @search="getApplicationListData" />
        </div>
        <a-table :columns="columns" :data="data" :pagination="paginationProps">
            <template #eventId="{ record }">{{ getActiveName(record.eventId) }}</template>
            <template #submitTime="{ record }">
                {{ moment(record.submitTime).format("YYYY-MM-DD hh:mm:ss") }}
            </template>
            <template #conditions="{ record }">
                <template v-for="(value, key) in formatCondition(record.conditions)">
                    <p>{{ key }}:{{ value }}</p>
                </template>
            </template>
            <template #operator="{ record }">
                <Modal v-if="modalShow === record.id" :item="record" @cancel="cancelHandler(record)" @getData="getApplicationListData" />
                <a-radio-group type="button" size="small" v-model="record.operator" @change="operatorHandler(record)">
                    <a-radio style="padding: 3px 6px" v-for="options in operatorOptions" :value="options.value">{{ options.label }}</a-radio>
                </a-radio-group>
            </template>
            <template #status="{ record }">
                <a-tag size="large" :color="transStatus(record.status)?.color">{{ transStatus(record.status)?.text }}</a-tag>
            </template>
        </a-table>
    </a-layout-content>
</template>

<script setup lang="ts">
import { transStatus } from "@/lib/format";
import Modal from "./Modal/index.vue";
import { listAllSubmittedComplexSearch } from "@/api/module/submit";
import { listAllEvent } from "@/api/module/event";
import type { ApplicationListType } from "./types";
import { StatusType } from "@/types/format";
import { Message, PaginationProps, TableColumnData } from "@arco-design/web-vue";
import moment from "moment";
import { find, orderBy } from "lodash";
import type { ListAllSearch } from "@/api/module/submit/types";
import type { TabStatus } from "@/types/global";

onMounted(async () => {
    await getAllActive();
    await getApplicationListData();
});

const data = ref<ApplicationListType[]>([]);
const activeList = ref<any>([]);
const searchUser = ref("");
async function getApplicationListData() {
    const params: ListAllSearch = {
        status: currentTabStatus.value,
    };
    if (params.status === "all") delete params.status;
    if (searchUser.value) params.member = searchUser.value;
    const { body, status } = await listAllSubmittedComplexSearch(params);
    if (status === "ok") {
        data.value = orderBy(body, ["submitTime"], ["desc"]);
        paginationProps.total = data.value.length;
    }
}
async function getAllActive() {
    const params = {
        size: 1000,
    };
    const { body, status, msg } = await listAllEvent(params);
    if (status === "ok") {
        const { content } = body;
        activeList.value = content;
    } else Message.error(msg);
}
const getActiveName = (eventId: number) => find(activeList.value, i => i.id === eventId).eventName;
const paginationProps = reactive<PaginationProps>({
    showTotal: true,
    pageSize: 10,
    total: 0,
});
const modalShow = ref<boolean | string>(false);
const currentTabStatus = ref<TabStatus>(0);
const tabPaneList = [
    {
        key: "all",
        title: "全部",
    },
    {
        key: 0,
        title: StatusType[0],
    },
    {
        key: 1,
        title: StatusType[1],
    },
    {
        key: 9,
        title: StatusType[9],
    },
];
const operatorOptions = [
    {
        label: StatusType[0],
        value: 0,
    },
    {
        label: StatusType[1],
        value: 1,
    },
    {
        label: StatusType[9],
        value: 9,
    },
];
const columns: TableColumnData[] = [
    {
        title: "申请时间",
        dataIndex: "submitTime",
        slotName: "submitTime",
        sortable: {
            sortDirections: ["ascend", "descend"],
        },
    },
    {
        title: "IP",
        dataIndex: "submitIP",
    },
    {
        title: "会员名称",
        dataIndex: "member",
    },
    {
        title: "活动名称",
        dataIndex: "eventId",
        slotName: "eventId",
    },
    {
        title: "自定义标题+填写的内容",
        dataIndex: "conditions",
        slotName: "conditions",
    },
    {
        title: "操作",
        dataIndex: "operator",
        slotName: "operator",
    },
    {
        title: "申请状态",
        dataIndex: "status",
        slotName: "status",
    },
    {
        title: "回复信息",
        dataIndex: "note",
    },
    {
        title: "操作者",
        dataIndex: "auditor",
    },
];
function operatorHandler(record: ApplicationListType) {
    modalShow.value = record.id;
}
function cancelHandler(record: ApplicationListType) {
    modalShow.value = false;
    record.operator = null;
}
function formatCondition(conditions: string) {
    const parseConditions = JSON.parse(conditions as string);
    return parseConditions;
}
</script>
