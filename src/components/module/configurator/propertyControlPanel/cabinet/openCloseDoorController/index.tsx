import React, { useEffect, useState } from "react";

import SwitchToggle from "../../../../../ui/toggle";
import { configuratorControlSelector } from "@/store/configuratorControl";
import { configuratorSelector, openCloseDoor, openCloseMultiDoor } from "@/store/configurator";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
};

const OpenCloseDoorController: React.FC<Props> = ({ transText }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets, selectedDoors, selectionControl } = useAppSelector(configuratorControlSelector);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const findKey = Object.keys(lockerWallData).find((key: string) => key === selectedCabinets?.[0]);
    if (!!findKey) {
      setIsOpened(Object.values(lockerWallData?.[findKey]?.doors)?.[0]?.isOpened ?? false);
    }
  }, [selectedCabinets]);

  /**
   * Handle opening and closing of the door for single locker and multi doors
   * @param val Boolean value for open/close of the door
   */
  const handleDoorOpenClose = (val: boolean) => {
    setIsOpened((prev) => !prev);
    if (!selectionControl.isGroupSelection && selectedCabinets.length > 0) {
      dispatch(openCloseDoor(selectedCabinets, val));
    } else if (selectionControl.isGroupSelection && selectionControl.selectionType === "cabinet") {
      dispatch(openCloseDoor(selectedCabinets, val));
    } else if (selectionControl.isGroupSelection && selectionControl.selectionType === "door") {
      const payload = selectedDoors.map((doorId: string) => {
        const splitId = doorId.split("_");

        return {
          lockerId: `Locker_${splitId[2]}`,
          doorId: `${splitId[0]}_${splitId[1]}`,
          idx: parseInt(splitId[4], 10),
        };
      });

      dispatch(openCloseMultiDoor(payload, val));
    }
  };

  return (
    <div className={styles.openToggle}>
      <p className={styles.label}>{transText?.openDoor}</p>
      <SwitchToggle
        defaultValue={isOpened}
        onChange={handleDoorOpenClose}
        prefix={transText?.no}
        suffix={transText?.yes}
        labelStyle="text-12"
      />
    </div>
  );
};

export default OpenCloseDoorController;
