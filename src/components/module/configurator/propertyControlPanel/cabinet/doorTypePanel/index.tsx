import React from "react";

import Selector from "@/components/ui/selector";
import { useAppSelector } from "@/utils/hooks/store";
import { configuratorSelector } from "@/store/configurator";
import { configuratorControlSelector } from "@/store/configuratorControl";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
};

const CabinetDoorTypePanel: React.FC<Props> = ({ transText }) => {
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets, selectionControl } = useAppSelector(configuratorControlSelector);

  return selectionControl.isGroupSelection ? (
    <div className={styles.wrapper}>
      <Selector
        value={{
          label: "All",
          value: "",
        }}
        label={transText?.doorType}
        setValue={() => {}}
        options={[
          {
            label: "All",
            value: "",
          },
        ]}
      />
    </div>
  ) : (
    <div className={styles.wrapper}>
      {selectedCabinets.length === 1 &&
        Object.keys(lockerWallData[selectedCabinets[0]]?.doors ?? []).map((key, idx) => (
          <div key={key} className={styles.item}>
            {idx + 1}
            <Selector
              value={{
                label: "All",
                value: "",
              }}
              label={transText?.doorType}
              setValue={() => {}}
              options={[
                {
                  label: "All",
                  value: "",
                },
              ]}
            />
          </div>
        ))}
    </div>
  );
};

export default CabinetDoorTypePanel;
