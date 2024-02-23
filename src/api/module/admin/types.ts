export interface LoginData {
    password: string;
    roles: number;
    userName: string;
}

type Roles = 1 | 2;
export interface UpdateAdminUSerType {
    enable: boolean;
    password: string;
    roles: Roles;
    userName: string;
}

export interface DeleteAdminType extends Omit<UpdateAdminUSerType, "enable"> {}
