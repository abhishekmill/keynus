"use client";

import React, { useEffect, useState } from "react";

import Selector from "../../../../../ui/selector";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import {
  configuratorSelector,
  removeIdentification,
  updateSideAccessoriesData,
} from "../../../../../../store/configurator";
import { configuratorControlSelector } from "../../../../../../store/configuratorControl";
import { IAccessoriesReferenceType } from "../../../../../../utils/types";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
  identificationData?: IAccessoriesReferenceType[];
};

const AccessoriesIdentificationTypePanels: React.FC<Props> = ({ transText, identificationData }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);

  const [selectedValue, setSelectedValue] = useState<{ label: string; value: string }>();

  useEffect(() => {
    if (identificationData?.[0]?.name) {
      const cabinetData = lockerWallData?.[selectedCabinets[0]]?.doors;
      if (!cabinetData) return;
      const identificationDoorPosition = Object.values(cabinetData).findIndex((item) => item.accessories.qrReader);
      if (identificationDoorPosition === -1) return;
      const selectedDoor = Object.values(cabinetData)?.[identificationDoorPosition]?.accessories?.qrReader?.id;
      const findItem = identificationData?.find((item) => item.articleId === selectedDoor);
      if (!findItem) return;
      setSelectedValue(() => {
        return { label: findItem?.name ?? "All", value: findItem?.articleId ?? "" };
      });
      dispatch(
        updateSideAccessoriesData({
          type: "qrReader",
          accessoryId: findItem?.articleId ?? "",
          url: findItem?.imageUrl3D ?? "",
          price: findItem?.price ?? 0,
        }),
      );
    }
  }, [identificationData]);

  return (
    <div className={styles.wrapper}>
      <Selector
        value={{
          label: selectedValue?.label ?? "All",
          value: selectedValue?.value ?? "",
        }}
        label={transText?.identificationType}
        setValue={(e) => {
          setSelectedValue({ label: e.label, value: e.value.toString() });
          if (e.value.toString() === "none") {
            dispatch(removeIdentification(selectedCabinets[0]));
          } else {
            const selectedArticle = identificationData?.find((item) => item.articleId === e.value.toString());
            dispatch(
              updateSideAccessoriesData({
                type: "qrReader",
                accessoryId: e.value.toString(),
                url: selectedArticle?.imageUrl3D ?? "",
                price: selectedArticle?.price ?? 0,
              }),
            );
          }
        }}
        options={[
          { label: "None", value: "none" },
          ...(identificationData?.map((item) => ({ label: item.name, value: item.articleId })) ?? []),
        ]}
      />
    </div>
  );
};

export default AccessoriesIdentificationTypePanels;
