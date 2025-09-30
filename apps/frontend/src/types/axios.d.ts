import 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        handlerEnabled?: boolean;
    }
}
