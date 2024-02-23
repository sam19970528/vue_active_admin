<template>
    <a-modal :body-style="bodyStyle" :default-visible="true" @before-ok="submit" @cancel="handleCancel" :width="920" :top="'30px'" unmountOnClose :simple="type === 'add'">
        <template v-if="type === 'edit'" #title>編輯:{{ item?.eventName }}</template>
        <Form :type="type" :preConditions="preConditions" :form="isFormOrItem" @getValidateData="emitValidateData"></Form>
    </a-modal>
</template>

<script lang="ts" setup>
import type { ActiveForm, ValidationType, Conditions } from "./Form/types";
import Form from "./Form/index.vue";
import { createEvent, updateEvent } from "@/api/module/event";
import { Message } from "@arco-design/web-vue";
import { cloneDeep } from "lodash";
import { formatConditionFromPairs, formatConditionToPairs } from "@/lib/format/index";

interface Props {
    type: string;
    item?: ActiveForm<string>;
}
const props = defineProps<Props>();
const emit = defineEmits(["cancel", "getData"]);
const handleCancel = () => emit("cancel");
const getData = () => emit("getData");
const bodyStyle = "max-height: 85vh;";
const { item } = toRefs<Props>(props);
const cloneDeepItem = ref();
const form = reactive<ActiveForm<Conditions>>({
    startTime: "",
    expireTime: "",
    eventName: "",
    detail: "",
    event_img: "",
    conditions: [],
});
const validationData = ref<ValidationType[]>();
const preConditions = ref<[string, string][]>([]);
if (props.item) {
    if (props.item.conditions !== null && !Array.isArray(props.item.conditions)) {
        preConditions.value = formatConditionToPairs(props.item.conditions);
    }
}
const isFormOrItem = computed<ActiveForm<Conditions>>(() => {
    if (props.item) {
        cloneDeepItem.value = cloneDeep(props.item);
        return cloneDeepItem.value;
    } else return form;
});
async function submit() {
    if (checkRequiredValidate().includes(false)) return false;
    else if (!checkConditionNotEmpty()) return false;
    isFormOrItem.value.conditions = [formatConditionFromPairs(preConditions.value)];
    let api;
    api = props.type === "add" ? createEvent : updateEvent;
    const { body, msg, status } = await api(isFormOrItem.value);
    if (status === "ok") {
        getData();
        Message.success({
            content: body,
            duration: 3000,
            onClose: () => {
                handleCancel();
            },
        });
    } else {
        Message.error(msg);
        return false;
    }
}
function checkRequiredValidate(): boolean[] {
    const validate: boolean[] = (validationData.value as ValidationType[]).map(item => {
        let result = true;
        if (item.rule === "required") {
            const validateMsg = `${item.filed}需必填`;
            if (isFormOrItem.value[item.value] === "") {
                Message.error(validateMsg);
                result = false;
            } else result = true;
        }
        return result;
    });
    return validate;
}
function checkConditionNotEmpty(): boolean {
    if (preConditions.value.length) {
        if (checkEmpty(preConditions.value)) {
            Message.error("自定义栏位不可为空");
            return false;
        } else return true;
    } else return true;
}
function checkEmpty(arr: string[][]): boolean {
    return arr.some(innerArr => innerArr.includes(""));
}
function emitValidateData(validation: ValidationType[]) {
    validationData.value = validation;
}
</script>
