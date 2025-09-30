"use client";

import React, { useEffect, useState } from "react";

import Selector from "../../../../../ui/selector";
import { IAccessoriesReferenceType } from "../../../../../../utils/types";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import { configuratorSelector, removePayment, updateSideAccessoriesData } from "../../../../../../store/configurator";
import { configuratorControlSelector } from "../../../../../../store/configuratorControl";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
  paymentData?: IAccessoriesReferenceType[];
};

const AccessoriesPaymentTypePanels: React.FC<Props> = ({ transText, paymentData }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);

  const [selectedValue, setSelectedValue] = useState<{ label: string; value: string }>();

  useEffect(() => {
    if (paymentData?.[0]?.name) {
      const cabinetData = lockerWallData?.[selectedCabinets[0]]?.doors;
      if (!cabinetData) return;
      const paymentDoorPosition = Object.values(cabinetData).findIndex((item) => item.accessories.payment);
      if (paymentDoorPosition === -1) return;
      const selectedDoor = Object.values(cabinetData)?.[paymentDoorPosition]?.accessories?.payment?.id;
      const findItem = paymentData?.find((item) => item.articleId === selectedDoor);
      if (!findItem) return;
      setSelectedValue(() => {
        return { label: findItem?.name ?? "All", value: findItem?.articleId ?? "" };
      });
      dispatch(
        updateSideAccessoriesData({
          type: "payment",
          accessoryId: findItem?.articleId ?? "",
          url: findItem?.imageUrl3D ?? "",
          price: findItem?.price ?? 0,
        }),
      );
    }
  }, [paymentData]);

  return (
    <div className={styles.wrapper}>
      <Selector
        value={{
          label: selectedValue?.label ?? "All",
          value: selectedValue?.value ?? "",
        }}
        label={transText?.paymentType}
        setValue={(e) => {
          setSelectedValue({ label: e.label, value: e.value.toString() });
          if (e.value.toString() === "none") {
            dispatch(removePayment(selectedCabinets[0]));
          } else {
            const selectedArticle = paymentData?.find((item) => item.articleId === e.value.toString());
            dispatch(
              updateSideAccessoriesData({
                type: "payment",
                accessoryId: e.value.toString(),
                url: selectedArticle?.imageUrl3D ?? "",
                price: selectedArticle?.price ?? 0,
              }),
            );
          }
        }}
        options={[
          { label: "None", value: "none" },
          ...(paymentData?.map((item) => ({ label: item.name, value: item.articleId })) ?? []),
        ]}
      />
    </div>
  );
};

export default AccessoriesPaymentTypePanels;
