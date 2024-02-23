<template>
    <a-layout-content class="content">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px">
            <div>
                <a-button type="primary" size="large" @click="modalShow = true" style="margin-right: 10px">
                    <template #icon>
                        <icon-plus />
                    </template>
                    新增活动
                </a-button>
            </div>
            <a-tabs type="rounded" v-model:active-key="currentTabStatus" @change="getActiveList">
                <a-tab-pane v-for="item in tabPaneList" :key="item.key" :title="item.title"></a-tab-pane>
            </a-tabs>
        </div>
        <a-list class="list-demo-action-layout" :bordered="false" :data="dataSource" :pagination-props="paginationProps" @page-size-change="pageSizeChange">
            <template #item="{ item }">
                <a-list-item class="list-demo-item" action-layout="vertical">
                    <Modal v-if="modalShow === item.id" @cancel="cancelHandler" @getData="getActiveList" :type="'edit'" :item="item" />
                    <template #actions>
                        <a-button type="outline" status="success" @click="openEditHandler(item.id)">編輯</a-button>
                        <template v-if="item.status !== 9">
                            <a-button v-if="item.status !== 1" type="primary" status="success" style="margin-right: 5px" @click="updateActiveStatus(item, 1)">开始</a-button>
                            <a-button type="primary" status="danger" @click="updateActiveStatus(item, 9)">停止</a-button>
                        </template>
                        <a-button @click="removeActive(item.id)" type="primary" status="warning">刪除</a-button>
                        <a-tag :color="transActiveBegin(item.status)?.color">{{ transActiveBegin(item.status)?.text }}</a-tag>
                    </template>
                    <template #extra>
                        <a-image width="175" height="119" :src="formatHttpsReplaceHttp(item.event_img)"></a-image>
                    </template>
                    <a-list-item-meta :title="item.eventName" :description="item.detail">
                        <template v-if="item.status === 1" #avatar>
                            <a-input-number :error="sortNumberError === item.id" :style="{ width: '80px' }" v-model="item.orderr" :min="1" :max="10000" @blur="updateSortData(item)" />
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
        <Modal v-if="modalShow === true" @cancel="cancelHandler" @getData="getActiveList" :type="'add'" />
    </a-layout-content>
</template>

<script lang="ts" setup>
import { transActiveBegin } from "@/lib/format";
import { listAllEvent, updateEvent, setEventOrder, deleteEvent } from "@/api/module/event";
import Modal from "./Modal/index.vue";
import { Message, PaginationProps } from "@arco-design/web-vue";
import { formatHttpsReplaceHttp, formatConditionFromPairs, formatConditionToPairs } from "@/lib/format";
import { orderBy, cloneDeep, filter } from "lodash";
import { ActiveType } from "@/types/format";
import type { TabStatus, ActiveStatus } from "@/types/global";
import type { ActiveForm, Conditions } from "./Modal/Form/types";
import { formatConditions } from "@/lib/format";
import { useComponentStore } from "@/store";

onMounted(() => {
    getActiveList();
});
const componentStore = useComponentStore();
const modalShow = ref<boolean | number>(false);
const paginationProps = reactive<PaginationProps>({
    showTotal: true,
    pageSize: 5,
    total: 0,
});
const currentTabStatus = ref<TabStatus>("all");
const tabPaneList = [
    {
        key: "all",
        title: "全部",
    },
    {
        key: 0,
        title: ActiveType[0],
    },
    {
        key: 1,
        title: ActiveType[1],
    },
    {
        key: 9,
        title: ActiveType[9],
    },
];
const dataSource = ref<any>([]);
const beginActive = ref<any[]>([]);
const unActive = ref<any[]>([]);
const closeActive = ref<any[]>([]);
const sortNumberError = ref("");
async function getActiveList() {
    const params: { status?: TabStatus; size: number } = {
        status: currentTabStatus.value,
        size: 1000,
    };
    if (params.status === "all") delete params.status;
    const { body, status, msg } = await listAllEvent(params);
    if (status === "ok") {
        const { content, totalElements } = body;
        filterActiveStatus(content);
        formatAndSortedBeginActive();
        updateDataSource();
        paginationProps.total = totalElements;
    } else Message.error(msg);
}
async function updateSortData(item: any) {
    if (!item.orderr) {
        sortNumberError.value = item.id;
        componentStore.alertNotifyHandle({
            type: "error",
            text: "排序数值不可为空",
        });
        return;
    } else {
        sortNumberError.value = "";
        await updateEventOrder({ eventId: item.id, order: item.orderr });
        await getActiveList();
    }
}
// 把三種不同狀態的list拆開來
function filterActiveStatus(content: any[]) {
    beginActive.value = filter(content, i => i.status === 1);
    unActive.value = filter(content, i => i.status === 0);
    closeActive.value = filter(content, i => i.status === 9);
}
// 進行中的list用map檢查沒有賦值的orderr 並直接更新setOrder
function formatAndSortedBeginActive() {
    const formatBeginActive = beginActive.value.map((item, index) => {
        if (!item.orderr) {
            item.orderr = index + 1;
            updateEventOrder({ eventId: item.id, order: item.orderr });
            return { ...item };
        } else {
            return { ...item };
        }
    });
    beginActive.value = orderBy(formatBeginActive, ["orderr"], ["desc"]);
}
function updateDataSource() {
    dataSource.value = [...beginActive.value, ...unActive.value, ...closeActive.value];
}
async function updateActiveStatus<T extends string | Conditions>(active: ActiveForm<T>, prop: ActiveStatus) {
    const item = cloneDeep(active);
    item.status = prop;
    const toPairCondition = formatConditionToPairs(item.conditions as string);
    (item.conditions as Conditions) = [formatConditionFromPairs(toPairCondition)];
    const { status, msg } = await updateEvent(item as ActiveForm<Conditions>);
    if (status === "ok") {
        getActiveList();
    } else {
        Message.error(msg);
    }
}
async function removeActive(eventId: number) {
    const params = { eventId };
    const { body, msg, status } = await deleteEvent(params);
    if (status === "ok") {
        Message.success(body);
        await getActiveList();
    } else Message.error(msg);
}
async function updateEventOrder({ eventId, order }: { eventId: number; order: string }) {
    const params = { eventId, order };
    await setEventOrder(params);
}
async function pageSizeChange(newPageSize: number) {
    paginationProps.pageSize = newPageSize;
    await getActiveList();
}
function openEditHandler(id: number) {
    modalShow.value = id;
}
function cancelHandler() {
    modalShow.value = false;
}
</script>

<style scoped>
.list-demo-action-layout .image-area {
    width: 183px;
    height: 119px;
    border-radius: 2px;
    overflow: hidden;
}

.list-demo-action-layout .list-demo-item {
    padding: 20px 0;
    border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
    width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
    margin: 0 4px;
}
.list-demo-item :deep(.arco-list-item-meta-title) {
    font-size: 20px;
}
/* .list-demo-item:hover {
    border: 2px solid #b9cfff;
    border-radius: 8px;
} */
.list-demo-item :deep(.arco-list-item-meta-description) {
    width: 60em;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.list-demo-item :deep(.arco-list-item-action) {
    align-items: center;
}
.list-demo-item :deep(.arco-list-item-action) > li {
    margin-right: 10px;
}
</style>
