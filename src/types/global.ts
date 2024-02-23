export interface Pagination {
    current: number;
    pageSize: number;
    total?: number;
}

export type TabStatus = number | "all";
export type ActiveStatus = 0 | 1 | 9;

export interface ParamsStatus {
    status?: TabStatus;
    size: number;
}
