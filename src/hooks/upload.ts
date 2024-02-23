import { ref } from "vue";
import type { FileItem } from "@arco-design/web-vue";

export function useUpload() {
    const uploadFile = ref<File | null>(null);
    function uploadImage(fileItem: FileItem[]) {
        const lastItem = fileItem.length - 1;
        uploadFile.value = fileItem[lastItem].file as File;
        const formData = new FormData();
        formData.append("image", uploadFile.value);
        return formData;
    }
    return {
        uploadFile,
        uploadImage,
    };
}
