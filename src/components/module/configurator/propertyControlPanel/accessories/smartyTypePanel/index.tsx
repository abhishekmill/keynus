"use client";
import React, { useEffect, useState } from "react";

import Selector from "../../../../../ui/selector";
import { IAccessoriesReferenceType } from "../../../../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import {
  configuratorSelector,
  removeDirectionSmarty,
  updateSideAccessoriesData,
} from "../../../../../../store/configurator";
import { configuratorControlSelector } from "../../../../../../store/configuratorControl";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
  smartyData?: IAccessoriesReferenceType[];
};

const AccessoriesSmartyTypePanels: React.FC<Props> = ({ transText, smartyData }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);

  const [selectedValue, setSelectedValue] = useState<{ label: string; value: string }>();

  useEffect(() => {
    if (smartyData?.[0]?.name) {
      const cabinetData = lockerWallData?.[selectedCabinets[0]]?.doors;
      if (!cabinetData) return;
      const smartyDoorPosition = Object.values(cabinetData).findIndex((item) => item.accessories.smarty);
      if (smartyDoorPosition === -1) return;
      const selectedDoor = Object.values(cabinetData)?.[smartyDoorPosition]?.accessories?.smarty?.id;
      const findItem = smartyData?.find((item) => item.articleId === selectedDoor);
      if (!findItem) return;
      setSelectedValue(() => {
        return { label: findItem?.name ?? "All", value: findItem?.articleId ?? "" };
      });
      dispatch(
        updateSideAccessoriesData({
          type: "smarty",
          accessoryId: findItem?.articleId ?? "",
          url: findItem?.imageUrl3D ?? "",
          price: findItem?.price ?? 0,
        }),
      );
    }
  }, [smartyData]);

  return (
    <div className={styles.wrapper}>
      <Selector
        value={{
          label: selectedValue?.label ?? "All",
          value: selectedValue?.value ?? "",
        }}
        label={transText?.smartyType}
        setValue={(e) => {
          setSelectedValue({ label: e.label, value: e.value.toString() });
          if (e.value === "none") {
            dispatch(removeDirectionSmarty(selectedCabinets[0]));
          } else {
            const selectedArticle = smartyData?.find((item) => item.articleId === e.value.toString());
            dispatch(
              updateSideAccessoriesData({
                type: "smarty",
                accessoryId: e.value.toString(),
                url: selectedArticle?.imageUrl3D ?? "",
                price: selectedArticle?.price ?? 0,
              }),
            );
          }
        }}
        options={[
          { label: "None", value: "none" },
          ...(smartyData?.map((item) => ({ label: item.name, value: item.articleId })) ?? []),
        ]}
      />
    </div>
  );
};

export default AccessoriesSmartyTypePanels;
