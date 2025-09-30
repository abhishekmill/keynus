"use client";
import React, { useEffect, useState } from "react";

import Selector from "../../../../../ui/selector";
import { ISidePanelType } from "../../../../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import { addSidePanelToLockerWall, configuratorSelector, removeSidePanel } from "../../../../../../store/configurator";
import { configuratorControlSelector } from "../../../../../../store/configuratorControl";
import { removeSidePanelOfAccessories } from "../../../../../../store/accessories";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
  sidePanelData?: ISidePanelType[];
};

const AccessoriesSidePanels: React.FC<Props> = ({ transText, sidePanelData }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);
  const [selectedValue, setSelectedValue] = useState<{ label: string; value: string }>();

  useEffect(() => {
    if (sidePanelData) {
      const findSidePanelUrl = lockerWallData?.[selectedCabinets[0]]?.sidePanel?.url;
      if (!!findSidePanelUrl) {
        const label = sidePanelData.find((item) => item.imageUrl3D === findSidePanelUrl)?.name;
        setSelectedValue(() => {
          return { label: label ?? "All", value: findSidePanelUrl ?? "" };
        });
      } else {
        setSelectedValue(() => {
          return { label: "All", value: "" };
        });
      }
    }
  }, [selectedCabinets]);
  return (
    <div className={styles.wrapper}>
      <Selector
        value={{
          label: selectedValue?.label ?? "All",
          value: selectedValue?.value ?? "",
        }}
        label={transText?.sidePanels}
        setValue={(e) => {
          setSelectedValue({ label: e.label, value: e.value.toString() });
          if (e.value.toString() === "none") {
            dispatch(removeSidePanel(selectedCabinets?.[0]));
            const sidePanel = lockerWallData[selectedCabinets[0]]?.sidePanel;
            if (sidePanel) {
              dispatch(removeSidePanelOfAccessories(sidePanel?.id ?? ""));
            }
          } else {
            const findItem = sidePanelData?.find((item) => item.imageUrl3D === e.value.toString());
            dispatch(
              addSidePanelToLockerWall({
                id: findItem?.articleId ?? "",
                lockerwallId: selectedCabinets?.[0],
                url: e.value.toString(),
                position: "unknown",
                price: findItem?.price ?? 0,
                articleName: e.label,
              }),
            );
          }
        }}
        options={[
          { label: "None", value: "none" },
          ...(sidePanelData?.map((item) => ({ label: item.name, value: item.imageUrl3D })) ?? []),
        ]}
      />
    </div>
  );
};

export default AccessoriesSidePanels;
