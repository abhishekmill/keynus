"use client";
import React, { useState } from "react";

import Button from "../../../../../ui/button";

import styles from "./style.module.scss";
import AppModal from "../../../../_basic/modal";
import WrapFoilModalContent from "./wrapFoilModal";

type Props = {
  transText?: { [key: string]: string };
};

const AccessoriesWrapFoilPanel: React.FC<Props> = ({ transText }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrapper}>
      <span className="text-12">{transText?.wrapFoilDescription}</span>
      <Button className={styles.button} label={transText?.placeWrapFoil} onClick={() => setOpen(true)} />
      <AppModal isOpen={open} setIsOpen={setOpen} size="md" hasClose>
        <WrapFoilModalContent />
      </AppModal>
    </div>
  );
};

export default AccessoriesWrapFoilPanel;
