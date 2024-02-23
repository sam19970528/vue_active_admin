import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
import { useUserStore, useComponentStore } from "@/store";
import router from "@/router";

const DEV_API = "http://192.168.0.126:9090";
const PROD_API = "https://transcenter2.tt289.com/event";
const baseURL = import.meta.env.DEV ? DEV_API : PROD_API;

type TAxiosOption = {
    timeout: number;
    baseURL: string;
};

const service = axios.create(<TAxiosOption>{
    timeout: 10000,
    baseURL: "/api",
});
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const userStore = useUserStore();
        userStore.loading = true;
        if (userStore.token) {
            (config.headers as AxiosRequestHeaders).Authorization = userStore.token as string;
        } else {
            if (router.currentRoute.value.path !== "/login") {
                router.push("/login");
            }
        }
        return config;
    },
    error => {
        const userStore = useUserStore();
        userStore.loading = false;
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const userStore = useUserStore();
        userStore.loading = false;
        return response.data;
    },
    error => {
        const userStore = useUserStore();
        const componentStore = useComponentStore();
        userStore.loading = false;
        let message;
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
            case 403:
                message = "拒绝访问请重新登入";
                break;
            case 404:
                message = "请求地址错误";
                break;
            case 500:
                message = "服务器回應錯誤";
                break;
            default:
                message = "网络连接故障";
        }
        componentStore.alertNotifyHandle({
            type: "error",
            text: message,
        });
        if (status === 403) {
            setTimeout(() => userStore.logout(), 2000);
        }
        return Promise.reject(error);
    }
);

export default service;
