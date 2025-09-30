import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Selector, { TOption } from "../../../../../ui/selector";
import { configuratorControlSelector } from "../../../../../../store/configuratorControl";
import {
  configuratorSelector,
  updateLockerColumnData,
  updateMultiLockerData,
} from "../../../../../../store/configurator";
import { materialMap } from "../../../../../../utils/materialMap";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";

import styles from "./style.module.scss";

const options = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "8", value: 8 },
  { label: "10", value: 10 },
];

type Props = {
  transText?: { [key: string]: string };
};

const CabinetConfigurationPanel: React.FC<Props> = ({ transText }) => {
  const [columnCount, setColumnCount] = useState<TOption>({ label: "1", value: 1 });
  const [rowCount, setRowCount] = useState<TOption>({ label: "1", value: 1 });
  const [disable, setDisable] = useState(false);

  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);

  useEffect(() => {
    if (!lockerWallData?.[selectedCabinets[0]]?.isCustom) {
      setDisable(true);
    } else if (selectedCabinets.length > 0) {
      setDisable(false);
      setRowCount({
        label: `${Object.keys(lockerWallData[selectedCabinets[0]]?.doors).length}`,
        value: Object.keys(lockerWallData[selectedCabinets[0]]?.doors).length,
      });
      setColumnCount({
        label: Object.keys(lockerWallData)?.length?.toString(),
        value: Object.keys(lockerWallData)?.length?.toString(),
      });
    }
  }, [selectedCabinets]);

  const handleColumnCount = (val: TOption) => {
    setColumnCount(val);
    dispatch(
      updateLockerColumnData(
        lockerWallData[selectedCabinets[0]],
        Number(val.value),
        lockerWallData[selectedCabinets[0]]?.position ?? 0,
      ),
    );
  };

  const handleRowCount = (val: TOption) => {
    setRowCount(val);
    const doors = {
      [`Door_${uuidv4()}`]: {
        type: "Normal",
        isOpened: false,
        texture: materialMap.egger_mfc?.[0],
        accessories: {},
        separateDoors: [
          {
            isOpened: false,
            texture: materialMap.egger_mfc[9],
          },
        ],
      },
    };
    new Array(+val.value - 1).fill(0).map((_, index) => {
      doors[`Door_${uuidv4()}`] = {
        type: "Normal",
        isOpened: false,
        texture: materialMap.egger_mfc?.[index + 1] ?? materialMap.egger_mfc[0],
        accessories: {},
        separateDoors: [
          {
            isOpened: false,
            texture: materialMap.egger_mfc[9],
          },
        ],
      };
    });
    console.log(doors);

    dispatch(
      updateMultiLockerData(
        {
          doors: doors,
        },
        selectedCabinets,
      ),
    );
  };

  return (
    <div className={styles.wrapper}>
      <Selector
        value={columnCount}
        label={transText?.columns}
        setValue={handleColumnCount}
        options={options}
        disabled={disable}
      />
      <Selector
        value={rowCount}
        label={transText?.compartments}
        setValue={handleRowCount}
        options={options}
        disabled={disable}
      />
    </div>
  );
};

export default CabinetConfigurationPanel;
