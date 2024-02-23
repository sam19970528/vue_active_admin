import request from "@/api/request";
import type { UpdateSettingType } from "./types";

export function getSysConfigInfo() {
    return request({
        url: `/sysConfig/info`,
        method: "get",
    });
}

export function sysConfigUpdate(data: UpdateSettingType) {
    return request({
        url: `/sysConfig/update`,
        method: "post",
        data,
    });
}
