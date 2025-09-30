"use client";

import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React from "react";

interface SessionExpiredModalProps {
  open: boolean;
  onOk: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  open,
  onOk,
}) => {
  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered
      maskClosable={false}
    >
      <div className="flex flex-col items-center gap-4 py-6">
        <ExclamationCircleOutlined style={{ fontSize: 48, color: "#faad14" }} />
        <h2 className="text-lg font-semibold">Phiên đăng nhập đã hết hạn</h2>
        <p className="text-gray-500 text-center">
          Vui lòng đăng nhập lại để tiếp tục sử dụng ứng dụng.
        </p>
        <button
          onClick={onOk}
          className="px-6 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        >
          Đăng nhập lại
        </button>
      </div>
    </Modal>
  );
};
