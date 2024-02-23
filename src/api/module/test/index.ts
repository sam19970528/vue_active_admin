import request from "@/api/request";

export function unauditedSubmittedEventCount() {
    return request({
        url: `/test/unauditedSubmittedEventCount`,
        method: "get",
    });
}
