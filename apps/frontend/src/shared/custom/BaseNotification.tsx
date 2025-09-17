"use client";
import React, { forwardRef, useImperativeHandle } from "react";
import { notification } from "antd";

export interface BaseNotificationRef {
  success: (options: {
    message: string;
    description?: string;
    pauseOnHover?: boolean;
  }) => void;
  error: (options: {
    message: string;
    description?: string;
    pauseOnHover?: boolean;
  }) => void;
  info: (options: {
    message: string;
    description?: string;
    pauseOnHover?: boolean;
  }) => void;
  warning: (options: {
    message: string;
    description?: string;
    pauseOnHover?: boolean;
  }) => void;
}

interface BaseNotificationProps {
  pauseOnHover?: boolean;
  showProgress?: boolean;
}

const BaseNotification = forwardRef<BaseNotificationRef, BaseNotificationProps>(
  ({ pauseOnHover = false, showProgress = false }, ref) => {
    const [api, contextHolder] = notification.useNotification();

    useImperativeHandle(ref, () => ({
      success: ({ message, description, pauseOnHover: customPause }) => {
        api.success({
          message,
          description,
          pauseOnHover: customPause ?? pauseOnHover,
          showProgress,
        });
      },
      error: ({ message, description, pauseOnHover: customPause }) => {
        api.error({
          message,
          description,
          pauseOnHover: customPause ?? pauseOnHover,
          showProgress,
        });
      },
      info: ({ message, description, pauseOnHover: customPause }) => {
        api.info({
          message,
          description,
          pauseOnHover: customPause ?? pauseOnHover,
          showProgress,
        });
      },
      warning: ({ message, description, pauseOnHover: customPause }) => {
        api.warning({
          message,
          description,
          pauseOnHover: customPause ?? pauseOnHover,
          showProgress,
        });
      },
    }));

    return <>{contextHolder}</>;
  }
);

BaseNotification.displayName = "BaseNotification";

export default BaseNotification;
