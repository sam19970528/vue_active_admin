<template>
    <a-form :model="form">
        <a-form-item label="开始－结束时间" :disabled="rangePickerDisabled">
            <a-range-picker style="width: 360px; margin: 0 24px 24px 0" :model-value="[form.startTime, form.expireTime]" show-time :disabled-date="disabledDateHandle" :disabledTime="getDisabledTime" :time-picker-props="defaultValueProps" format="YYYY-MM-DDTHH:mm:ss.sssZ" @ok="rangePickerOnOk" />
        </a-form-item>
        <a-form-item field="eventName" label="活动项目名称" :rules="requiredRules('活动项目')" :validate-trigger="['change', 'input']">
            <a-input v-model="form.eventName" placeholder="请输入活动项目名称" />
        </a-form-item>
        <a-form-item field="detail" label="活动详情" :rules="requiredRules('活动详情')" :validate-trigger="['change', 'input']">
            <a-textarea v-model="form.detail" :auto-size="computedAutoSize" />
        </a-form-item>
        <a-form-item label="活动图(PNG或JPG格式)">
            <a-upload draggable :show-file-list="false" :auto-upload="false" action="/" @change="uploadEventImageHandle" />
        </a-form-item>
        <a-form-item v-if="form.event_img" field="event_img" label="预览活动图">
            <a-image :width="'300px'" :src="formatHttpsReplaceHttp(form.event_img)" show-loader />
        </a-form-item>
        <a-form-item v-for="(_, index) of preConditions" :key="index">
            <a-input v-model="preConditions[index][0]" style="width: 200px; margin-right: 10px" placeholder="请输入自定义栏位标题" />
            <a-input v-model="preConditions[index][1]" style="width: 200px" placeholder="请输入自定义栏位提示文字" />
            <a-button type="primary" status="danger" @click="conditionsDelete(index)" :style="{ marginLeft: '10px' }">删除</a-button>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" status="warning" @click="conditionsAdd">新增自订义栏位</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts" setup>
import type { ActiveForm, ValidationType, Conditions } from "./types";
import type { FileItem } from "@arco-design/web-vue";
import { CalendarValue } from "@arco-design/web-vue/es/date-picker/interface";
import { uploadEventImage } from "@/api/module/event";
import { Message } from "@arco-design/web-vue";
import { formatHttpsReplaceHttp } from "@/lib/format";
import { includes } from "lodash";
import { useUpload } from "@/hooks/upload";
import dayjs from "dayjs";

onMounted(() => {
    const validationData: ValidationType[] = [
        {
            filed: "活动项目名称",
            value: "eventName",
            rule: "required",
        },
        {
            filed: "活动详情",
            value: "detail",
            rule: "required",
        },
    ];
    emit("getValidateData", validationData);
});

interface Props {
    type: string;
    form: ActiveForm<Conditions>;
    preConditions: [string, string][];
}
const props = defineProps<Props>();
const { form, preConditions } = toRefs(props);
const emit = defineEmits(["getValidateData"]);
const { uploadImage } = useUpload();

const computedAutoSize = computed(() => {
    if (props.type === "add")
        return {
            minRows: 15,
        };
    else return true;
});

const conditionsAdd = () => preConditions.value.push(["", ""]);
const afterOneHour = dayjs().hour() + 1;

const conditionsDelete = (index: number) => preConditions.value.splice(index, 1);

async function uploadEventImageHandle(fileItem: FileItem[]) {
    const formData = uploadImage(fileItem);
    const { body, msg, status } = await uploadEventImage(formData);
    if (status === "ok") {
        form.value.event_img = body.EventImgUrl;
        Message.success("上传图片成功!");
    } else {
        Message.error(msg);
        form.value.event_img = "";
    }
}
function rangePickerOnOk(dateString: CalendarValue[]) {
    form.value.startTime = dateString[0] as string;
    form.value.expireTime = dateString[1] as string;
}
function range(start: number, end: number) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}
function getDisabledTime(current: Date, type: "start" | "end") {
    return {
        disabledHours: () => (type === "start" ? range(0, afterOneHour) : range(0, 0)),
        disabledSeconds: () => range(1, 60),
    };
}
function requiredRules(filed: string) {
    const message = `${filed}需必填`;
    return [{ required: true, message }];
}
function disabledDateHandle(current: Date) {
    return dayjs(current).isBefore(dayjs().startOf("D"));
}
const defaultValueProps = computed(() => ({ defaultValue: [`${afterOneHour}:00:00`, `${afterOneHour}:00:00`] }));
const rangePickerDisabled = computed(() => includes([1, 9], form.value?.status));
</script>
