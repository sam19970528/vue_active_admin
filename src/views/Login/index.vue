<template>
    <div class="container">
        <div class="content">
            <div class="content-inner">
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<script setup>
import LoginForm from "./components/LoginForm.vue";
</script>

<style lang="less" scoped>
.container {
    display: flex;
    height: 100vh;

    .content {
        position: relative;
        display: flex;
        flex: 1;
        justify-content: center;
        padding-bottom: 40px;
        margin-top: 300px;
    }
}
</style>
