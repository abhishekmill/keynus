import React from "react";

import MaterialPicker from "../../../../_basic/materialPicker";
import { changeDoorMaterial, changeMultiDoorMaterial, configuratorSelector } from "@/store/configurator";
import { configuratorControlSelector } from "@/store/configuratorControl";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";
import { IArticleColors, IKeyniusPIMArticle } from "../../../../../../utils/types";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
  articleData?: IKeyniusPIMArticle;
};

const CabinetDoorColorPanel: React.FC<Props> = ({ articleData }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets, selectionControl, selectedDoors } = useAppSelector(configuratorControlSelector);

  const handleDoorColorChange = (doorId: string, material: string) => {
    dispatch(changeDoorMaterial(selectedCabinets[0], doorId, material));
  };

  const handleMultiDoorColorChange = (mat: string) => {
    if (selectionControl.isGroupSelection && selectionControl.selectionType === "cabinet") {
      if (selectedCabinets.length > 0) {
        const payload = selectedCabinets
          .map((cabinetId) =>
            Object.keys(lockerWallData[cabinetId].doors).flatMap((doorId) => {
              const door = lockerWallData[cabinetId].doors[doorId];
              // If door has separateDoors, create entries for each separate door
              if (door.separateDoors && door.separateDoors.length > 0) {
                return door.separateDoors.map((_, idx) => ({
                  lockerId: cabinetId,
                  doorId: doorId,
                  idx: idx,
                }));
              }
              // If no separateDoors, use idx: 0 as default
              return [{ lockerId: cabinetId, doorId: doorId, idx: 0 }];
            }),
          )
          .flat();

        dispatch(changeMultiDoorMaterial(payload, mat));
      }
    } else if (selectionControl.isGroupSelection && selectionControl.selectionType === "door") {
      if (selectedDoors.length > 0) {
        const payload = selectedDoors.map((doorId: string) => {
          const splitId = doorId.split("_");
          return {
            lockerId: `Locker_${splitId[2]}`,
            doorId: `${splitId[0]}_${splitId[1]}`,
            idx: parseInt(splitId[4]) || 0,
          };
        });

        dispatch(changeMultiDoorMaterial(payload, mat));
      }
    }
  };

  // Handle changing all doors in the selected cabinet at once
  const handleAllDoorsColorChange = (mat: string) => {
    const cabinetId = selectedCabinets[0];
    const doorIds = Object.keys(lockerWallData[cabinetId]?.doors ?? {});

    // Change all doors to the same material
    doorIds.forEach((doorId) => {
      dispatch(changeDoorMaterial(cabinetId, doorId, mat));
    });
  };

  // Filter door materials once to avoid repetition
  const doorMaterials = articleData?.colors?.filter((row: IArticleColors) => row.colorType === "door") ?? [];

  // Get the current material of the first door to show as active (assuming all doors will have same material after selection)
  let currentActiveMaterial;

  if (selectionControl.isGroupSelection && selectionControl.selectionType === "door") {
    selectedDoors.forEach((doorId: string) => {
      const splitId = doorId.split("_");
      const lockerId = `Locker_${splitId[2]}`;
      const doorKey = `${splitId[0]}_${splitId[1]}`;

      const idx = parseInt(splitId[4]) || 0;
      const materials = lockerWallData[lockerId]?.doors?.[doorKey]?.separateDoors;

      if (idx === 1) {
        currentActiveMaterial = materials[1].texture;
      } else if (materials?.length) {
        currentActiveMaterial = materials[0]?.texture;
      } else {
        currentActiveMaterial = lockerWallData[lockerId]?.doors?.[doorKey].texture;
      }
    });
  } else {
    currentActiveMaterial = selectedCabinets[0]
      ? Object.values(lockerWallData[selectedCabinets[0]]?.doors ?? {})[0]?.texture
      : undefined;
  }

  return selectionControl.isGroupSelection ? (
    <div className={styles.wrapper}>
      <div className={styles.item}>
        <MaterialPicker
          materials={doorMaterials}
          activeMaterials={currentActiveMaterial ? [currentActiveMaterial] : []}
          onChange={handleMultiDoorColorChange}
        />
      </div>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.item}>
        {/* <div className={styles.number}>All Doors</div> */}
        <MaterialPicker
          materials={doorMaterials}
          activeMaterials={currentActiveMaterial ? [currentActiveMaterial] : []}
          onChange={handleAllDoorsColorChange}
        />
      </div>
    </div>
  );
};

export default CabinetDoorColorPanel;
