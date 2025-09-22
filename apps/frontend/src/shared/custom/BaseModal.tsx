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
  modalContent: React.ReactNode;
  onOk: () => void;
  onCancel: () => void;
  useGlobalState?: boolean;
  initialType?: string;
  initialData?: any;
  width?: number | string;
}

const BaseModal = ({
  buttonClassName,
  buttonLabel,
  buttonType = "primary",
  modalContent,
  onOk,
  onCancel,
  useGlobalState = false,
  initialType = "default",
  initialData = null,
  width = 1280,
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
        title={null}
        open={isOpen}
        onOk={() => {
          onOk();
          handleClose();
        }}
        onCancel={handleClose}
        footer={null}
        closable={true}
        closeIcon={
          <span className="text-gray-500 text-xl leading-none">×</span>
        }
        transitionName="ant-fade"
        width={width}
        styles={{
          body: {
            height: "auto",
            padding: 0,
            display: "block",
            overflow: "hidden",
            maxHeight: "90vh",
            borderRadius: "10px",
          },
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
        className="p-0! m-0! ig-modal"
        getContainer={false}
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default BaseModal;
