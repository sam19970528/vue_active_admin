import "axios";

interface Res {
    body: any;
    msg: string;
    status: string;
}
declare module "axios" {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<Res>;
    }
}
