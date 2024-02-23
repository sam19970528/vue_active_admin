<template>
    <a-alert class="global-fixed-center" :title="alertState.text" :type="alertState.type"></a-alert>
</template>

<script setup lang="ts">
import { useComponentStore } from "@/store";
const componentStore = useComponentStore();
const alertState = computed(() => componentStore.alertState);
</script>

<style scoped>
.global-fixed-center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    z-index: 1000;
}
</style>
