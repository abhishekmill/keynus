"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "../../../../../ui/button";
import Selector from "../../../../../ui/selector";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import { addWallSmarty, configuratorSelector } from "../../../../../../store/configurator";
import { configuratorControlSelector } from "../../../../../../store/configuratorControl";
import { addAccessoryData } from "../../../../../../store/accessories";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
};

type TOption = {
  label: string;
  value: string;
};

const AccessoriesSmartyLocationPanel: React.FC<Props> = ({ transText }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData, sideAccessoriesData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);
  const [compartmentValue, setCompartmentValue] = useState<TOption>();
  const [columnValue, setColumnValue] = useState<TOption>();
  const [compartmentOption, setCompartmentOption] = useState<TOption[]>([]);
  const columnLength = lockerWallData?.[selectedCabinets?.[0]]?.column ?? 0;

  const onSubmit = () => {
    const smartyData = sideAccessoriesData?.find((item) => item.type === "smarty");
    if (!!smartyData && compartmentValue) {
      // Use the new action instead of addSmarty
      dispatch(
        addWallSmarty({
          url: smartyData?.url ?? "",
          accessoryId: smartyData?.accessoryId ?? "",
          type: "smarty",
          targetCabinetId: selectedCabinets[0],
          compartmentPosition: compartmentValue?.value,
          columnPosition: Number(columnValue?.value ?? 1),
        }),
      );

      // Check if there's already a smarty in any cabinet
      const existingSmarty = Object.keys(lockerWallData).some((cabinetId) =>
        Object.values(lockerWallData[cabinetId].doors).some((doorData) => !!doorData.accessories.smarty),
      );

      if (!existingSmarty) {
        dispatch(
          addAccessoryData({
            keyniusPIMArticleId: smartyData?.accessoryId ?? "",
            articleName: "Smarty",
            price: smartyData?.price ?? 0,
            quantity: 1,
          }),
        );
      }
    } else {
      toast.warning("Please select a smarty type or position");
    }
  };

  useEffect(() => {
    if (lockerWallData) {
      const doorData = lockerWallData?.[selectedCabinets?.[0]]?.doors;
      if (doorData) {
        const compartmentList = Object.keys(doorData)?.map((key, index) => ({
          label: `${index + 1}`,
          value: key,
        }));
        setCompartmentOption(compartmentList);
        const defaultValue = Object.keys(doorData).find((key) => doorData[key].accessories.smarty);
        const defaultLabel = Object.values(doorData).findIndex((item) => item.accessories.smarty) + 1;
        if (defaultLabel !== 0 && defaultValue) {
          setCompartmentValue({
            label: `${defaultLabel ?? "All"}`,
            value: `${defaultValue ?? ""}`,
          });
        }
        Object.values(doorData).forEach((item) => {
          if (item.accessories.smarty) {
            setColumnValue({
              label: `${item.accessories.smarty.columnPosition ?? "All"}`,
              value: `${item.accessories.smarty.columnPosition ?? ""}`,
            });
          }
        });
      }
    }
  }, [selectedCabinets]);

  return (
    <div className={styles.wrapper}>
      <span className="text-12">{transText?.smartyLocationDescription}</span>
      {columnLength > 1 && (
        <Selector
          value={{
            label: columnValue?.label ?? "All",
            value: columnValue?.value ?? 0,
          }}
          label={transText?.column}
          setValue={(e) => {
            setColumnValue({ label: e.label, value: e.value.toString() });
          }}
          options={Array.from({ length: columnLength }, (_, index) => ({
            label: `${index + 1}`,
            value: `${index + 1}`,
          }))}
          className="mb-10"
        />
      )}
      <Selector
        value={{
          label: compartmentValue?.label ?? "All",
          value: compartmentValue?.value ?? "",
        }}
        label={transText?.compartment}
        setValue={(e) => {
          setCompartmentValue({ label: e.label, value: e.value.toString() });
        }}
        options={compartmentOption}
      />
      <Button className={styles.button} label={transText?.placeSmarty} onClick={onSubmit} />
    </div>
  );
};

export default AccessoriesSmartyLocationPanel;
