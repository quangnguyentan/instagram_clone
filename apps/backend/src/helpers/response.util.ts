// src/common/utils/response.util.ts
export interface IResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

export const successResponse = <T>(
  data: T,
  message = 'Thành công',
  meta?: any,
): IResponse<T> => {
  return {
    success: true,
    message,
    data,
    meta,
  };
};

export const errorResponse = (
  message = 'Có lỗi xảy ra',
  error?: any,
): IResponse => {
  return {
    success: false,
    message,
    data: error ? error.message || error : undefined,
  };
};
