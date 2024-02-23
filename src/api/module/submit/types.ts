import type { TabStatus } from "@/types/global";
export interface ApproveForm {
    id: string;
    note: string;
    status: number;
}

export interface ListAllSearch {
    member?: string;
    status?: TabStatus;
}
