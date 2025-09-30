import React, { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

import styles from "./style.module.scss";
import classNames from "classnames";
import Icon from "../../../ui/Icon";

type Props = {
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hasClose?: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppModal: React.FC<Props> = ({ isOpen, setIsOpen, children, size = "sm", hasClose = false }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className={styles.wrapper} onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className={styles.content}>
          <div className={styles.modalContent}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(styles.panel, {
                  [styles.sm]: size === "sm",
                  [styles.md]: size === "md",
                  [styles.lg]: size === "lg",
                  [styles.xl]: size === "xl",
                })}
              >
                {children}
                {hasClose && (
                  <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
                    <Icon name="XMark" className={styles.icon} />
                  </button>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AppModal;
