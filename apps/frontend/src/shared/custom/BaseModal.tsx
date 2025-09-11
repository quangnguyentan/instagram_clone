import React, { useState } from "react";
import { Modal } from "antd";
import BaseButton from "./BaseButton";
import useModalStore from "../../stores/modalStore";

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
}: BaseModalProps) => {
  const { open, setOpen, cancel } = useModalStore();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    onOk();
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
        onCancel={cancel}
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
