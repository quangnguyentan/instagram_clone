"use client";
import { useCallback } from "react";
import useModalStore from "@/stores/modalStore";
/* eslint-disable @typescript-eslint/no-explicit-any */

const useOpenModal = () => {
  const { setModal, closeModal } = useModalStore();

  const openModal = useCallback(
    (type: string, data?: any) => {
      setModal(type, data);
    },
    [setModal]
  );

  const closeModalHandler = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return { openModal, closeModal: closeModalHandler };
};

export default useOpenModal;
