import request from "@/api/request";
import type { ApproveForm, ListAllSearch } from "./types";

export function listAllSubmittedComplexSearch(params?: ListAllSearch) {
    return request({
        url: `/submit/listAllSubmittedComplexSearch`,
        method: "get",
        params,
    });
}

export function approveByAdmin(data: ApproveForm) {
    return request({
        url: `/submit/approveByAdmin`,
        method: "post",
        data,
    });
}
