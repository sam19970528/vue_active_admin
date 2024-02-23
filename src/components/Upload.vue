<template>
    <a-upload action="/" :show-file-list="false" :auto-upload="false" @change="uploadLogoHandle">
        <template #upload-button>
            <div class="arco-upload-list-item">
                <div v-if="logoItem?.prop" class="arco-upload-list-picture custom-upload-avatar logo">
                    <img :src="formatHttpsReplaceHttp(logoItem.prop)" />
                    <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                    </div>
                </div>
                <div class="arco-upload-picture-card logo" v-else>
                    <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600">Logo</div>
                    </div>
                </div>
            </div>
        </template>
    </a-upload>
</template>

<script lang="ts" setup>
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { useUpload } from "@/hooks/upload";
import { uploadFrontEndImage } from "@/api/module/event";
import { FileItem, Message } from "@arco-design/web-vue";
import type { SettingItem } from "@/views/setting/types";
import { formatHttpsReplaceHttp } from "@/lib/format";

interface Props {
    logoItem: SettingItem;
}
const props = defineProps<Props>();
const { uploadImage } = useUpload();

async function uploadLogoHandle(fileItem: FileItem[]) {
    const formData = uploadImage(fileItem);
    const { body, msg, status } = await uploadFrontEndImage(formData);
    if (status === "ok") {
        props.logoItem.prop = body.FrontEndImgUrl;
        Message.success("上传图片成功!");
    } else {
        Message.error(msg);
    }
}
</script>

<style scoped lang="less">
.logo {
    width: 270px;
    height: 80px;
}
</style>
