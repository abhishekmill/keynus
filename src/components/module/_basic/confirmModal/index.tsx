"use client";
import React from "react";

import AppModal from "../modal";

import styles from "./style.module.scss";
import Button from "../../../ui/button";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  message?: string;
  onOk?: Function;
  hasCancelFunction?: boolean;
  onCancel?: Function;
  transText?: { [key: string]: string };
  confirmLoading?: boolean;
  cancelLoading?: boolean;
};

const AppConfirmModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  title = "",
  message = "",
  onOk = () => {},
  onCancel = () => {},
  hasCancelFunction = false,
  transText,
  confirmLoading = false,
  cancelLoading = false,
}) => {
  return (
    <AppModal size="sm" isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.wrapper}>
        <h5 className={styles.heading}>{title}</h5>
        <p>{message}</p>
        <div className={styles.actionWrapper}>
          <Button
            label={transText?.no}
            color="danger"
            className={styles.button}
            isLoading={cancelLoading}
            disabled={cancelLoading}
            onClick={() => {
              if (hasCancelFunction) {
                onCancel();
              } else {
                setIsOpen(false);
              }
            }}
          />
          <Button
            label={transText?.yes}
            className={styles.button}
            onClick={async () => {
              await onOk();
              setIsOpen(false);
            }}
            isLoading={confirmLoading}
            disabled={confirmLoading}
          />
        </div>
      </div>
    </AppModal>
  );
};

export default AppConfirmModal;
