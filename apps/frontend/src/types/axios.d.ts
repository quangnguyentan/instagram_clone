import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipInterceptor?: boolean;
        _retry?: boolean;
    }
}
