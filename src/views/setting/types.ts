export interface ResBodyItem {
    id: string;
    prop: string;
}

export interface SettingItem extends ResBodyItem {
    label?: string;
    width?: string;
    append?: string;
}
