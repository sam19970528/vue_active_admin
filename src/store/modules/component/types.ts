export type AlertTypes = "normal" | "success" | "warning" | "error" | "info";

export interface AlertStateType {
    type: AlertTypes;
    text: string;
}

export interface NotifyHandleType extends AlertStateType {
    timeout?: number;
}
