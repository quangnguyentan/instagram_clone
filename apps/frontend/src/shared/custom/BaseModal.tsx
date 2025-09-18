"use client";
import React from "react";
import { Modal } from "antd";
import BaseButton from "./BaseButton";
import useModalStore from "../../stores/modalStore";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface BaseModalProps {
  buttonClassName?: string;
  buttonLabel?: React.ReactNode;
  buttonType?: "primary" | "dashed" | "link" | "text" | "default";
  title?: React.ReactNode | string;
  modalContent: React.ReactNode;
  onOk: () => void;
  onCancel: () => void;
  useGlobalState?: boolean;
  initialType?: string; // Type mặc định khi mở modal global
  initialData?: any;
  width?: number | string; // Thêm prop width
  height?: number | string; // Thêm prop height
}

const BaseModal = ({
  buttonClassName,
  buttonLabel,
  buttonType = "primary",
  title,
  modalContent,
  onOk,
  onCancel,
  useGlobalState = false,
  initialType = "default",
  initialData = null,
  width = 1000, // Mặc định 1000px
  height = "auto", // Mặc định tự động điều chỉnh
}: BaseModalProps) => {
  const { open, setModal, closeModal } = useModalStore();
  const [isLocalOpen, setIsLocalOpen] = React.useState(false);

  const isOpen = useGlobalState ? open : isLocalOpen;

  const showModal = () => {
    if (useGlobalState) {
      setModal(initialType, initialData);
    } else {
      setIsLocalOpen(true);
    }
  };

  const handleClose = () => {
    if (useGlobalState) {
      closeModal();
    } else {
      setIsLocalOpen(false);
    }
    onCancel();
  };

  const modalStyle = {
    width:
      width === "100%"
        ? "100vw" // Chuyển 100% thành 100vw
        : typeof width === "number"
          ? `${width}px` // Chuyển number thành px
          : width,
    height:
      height === "100%"
        ? "100vh" // Chuyển 100% thành 100vh
        : height,
    maxWidth: "100vw", // Giới hạn tối đa là toàn bộ chiều rộng viewport
    maxHeight: "100vh", // Giới hạn tối đa là toàn bộ chiều cao viewport
  };

  return (
    <>
      {buttonLabel && !useGlobalState && (
        <BaseButton
          handleClick={showModal}
          type={buttonType}
          className={buttonClassName}
        >
          {buttonLabel}
        </BaseButton>
      )}
      <Modal
        title={title}
        open={isOpen}
        onOk={() => {
          onOk();
          handleClose();
        }}
        onCancel={handleClose}
        footer={null}
        closable={true}
        transitionName="ant-fade"
        width={width} // Áp dụng width từ prop
        style={modalStyle}
        className="p-0! m-0! mx-auto!  "
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default BaseModal;
