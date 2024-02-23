import request from "@/api/request";
import type { LoginData, UpdateAdminUSerType, DeleteAdminType } from "./types";

export function login(data: LoginData) {
    return request({
        url: `/admin/login`,
        method: "post",
        data,
    });
}

export function listAllAdminUser() {
    return request({
        url: `/admin/listAllAdminUser`,
        method: "post",
    });
}

export function createAdminUser(data: UpdateAdminUSerType) {
    return request({
        url: `/admin/createAdminUser`,
        method: "post",
        data,
    });
}

export function updateAdminUser(data: UpdateAdminUSerType) {
    return request({
        url: `/admin/updateAdminUser`,
        method: "post",
        data,
    });
}

export function deleteAdminUser(data: DeleteAdminType) {
    return request({
        url: `/admin/deleteAdminUser`,
        method: "post",
        data,
    });
}

export function getAllBlackList() {
    return request({
        url: `/admin/getAllBlackList`,
        method: "get",
    });
}
type IP = { ip: string };

export function addBlackItem(params: IP) {
    return request({
        url: `/admin/addBlackItem`,
        method: "get",
        params,
    });
}

export function deleteBlackItem(params: IP) {
    return request({
        url: `/admin/deleteBlackItem`,
        method: "get",
        params,
    });
}

export function searchBlackList(params: IP) {
    return request({
        url: `/admin/searchBlackList`,
        method: "get",
        params,
    });
}
