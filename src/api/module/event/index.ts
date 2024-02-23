import request from "@/api/request";
import type { ActiveForm } from "@/views/ActiveManage/Modal/Form/types";
import type { TabStatus, ParamsStatus } from "@/types/global";
import type { Conditions } from "@/views/ActiveManage/Modal/Form/types";

export function createEvent(data: ActiveForm<Conditions>) {
    return request({
        url: `/event/createEvent`,
        method: "post",
        data,
    });
}

export function listAllEvent(params?: ParamsStatus) {
    return request({
        url: `/event/listAllEventByStatus`,
        method: "get",
        params,
    });
}

export function uploadEventImage(data: FormData) {
    return request({
        url: `/event/uploadEventImage`,
        method: "post",
        data,
        headers: {
            "Content-Disposition": "form-data;name=image",
        },
    });
}

export function updateEvent(data: ActiveForm<Conditions>) {
    return request({
        url: `/event/updateEvent`,
        method: "post",
        data,
    });
}

export function setEventOrder(params: { eventId: number; order: string }) {
    return request({
        url: `/event/setEventOrder`,
        method: "post",
        params,
    });
}

export function deleteEvent(params: { eventId: number }) {
    return request({
        url: `/event/deleteEvent`,
        method: "post",
        params,
    });
}

export function uploadFrontEndImage(data: FormData) {
    return request({
        url: `/event/uploadFrontEndImage`,
        method: "post",
        data,
        headers: {
            "Content-Disposition": "form-data;name=image",
        },
    });
}
