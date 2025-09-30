import React from "react";

import styles from "./style.module.scss";
import { useAppSelector } from "../../../../../utils/hooks/store";
import { configuratorSelector } from "../../../../../store/configurator";

type Props = {
  transText: { [key: string]: string };
};

const NumberPanel: React.FC<Props> = ({ transText }) => {
  const { lockerWallData } = useAppSelector(configuratorSelector);

  return (
    <div className={styles.numberPanel}>
      <div className={styles.item}>
        <p className={styles.label}>{transText?.columns}:</p>{" "}
        {Object.values(lockerWallData).reduce((sum, item) => sum + (item.column ?? 1), 0)}
      </div>
      <div className={styles.item}>
        <p className={styles.label}>{transText?.doors}:</p>{" "}
        {Object.keys(lockerWallData)
          .map(
            (cabinetId) =>
              Object.keys(lockerWallData[cabinetId].doors).length * (lockerWallData[cabinetId]?.column ?? 1),
          )
          .reduce((sum, item) => sum + item, 0)}
      </div>
    </div>
  );
};

export default NumberPanel;
