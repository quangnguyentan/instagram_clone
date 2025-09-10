import React, { useState } from "react";
import { Modal } from "antd";
import BaseButton from "./BaseButton";

interface BaseModalProps {
  buttonClassName?: string;
  buttonLabel: React.ReactNode;
  buttonType?: "primary" | "dashed" | "link" | "text" | "default";
  title: React.ReactNode | string;
  modalContent: React.ReactNode;
  onOk: () => void;
  onCancel: () => void;
}

const BaseModal = ({
  buttonClassName,
  buttonLabel,
  buttonType = "primary",
  title,
  modalContent,
  onOk,
  onCancel,
}: BaseModalProps) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    onOk();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <>
      <BaseButton
        handleClick={showModal}
        type={buttonType}
        className={buttonClassName}
      >
        {buttonLabel}
      </BaseButton>
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        closable={true}
        transitionName="ant-fade"
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default BaseModal;
