export interface ApplicationListType {
    id: string;
    submitTime: string;
    auditTime: string;
    submitIP: string;
    member: string;
    conditions: string;
    operator: number | null;
    status: number;
    note: string;
    eventId: number;
}
