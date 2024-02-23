export type Conditions = { [key: string]: string }[];

export interface ActiveForm<T> {
    startTime: string;
    expireTime: string;
    eventName: string;
    detail: string;
    event_img: string;
    conditions: T;
    id?: number;
    status?: number;
}

export interface ValidationType {
    filed: string;
    value: "eventName" | "detail" | "startTime" | "expireTime";
    rule: "required";
}
