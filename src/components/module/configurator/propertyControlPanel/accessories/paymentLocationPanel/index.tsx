"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "../../../../../ui/button";
import { useAppDispatch, useAppSelector } from "../../../../../../utils/hooks/store";
import { addPayment, configuratorSelector } from "../../../../../../store/configurator";
import { configuratorControlSelector } from "../../../../../../store/configuratorControl";
import Selector from "../../../../../ui/selector";
import { addAccessoryData } from "../../../../../../store/accessories";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
};

type TOption = {
  label: string;
  value: string;
};

const AccessoriesPaymentLocationPanel: React.FC<Props> = ({ transText }) => {
  const dispatch = useAppDispatch();
  const { lockerWallData, sideAccessoriesData } = useAppSelector(configuratorSelector);
  const { selectedCabinets } = useAppSelector(configuratorControlSelector);
  const [compartmentValue, setCompartmentValue] = useState<TOption>();
  const [columnValue, setColumnValue] = useState<TOption>();
  const [compartmentOption, setCompartmentOption] = useState<TOption[]>([]);
  const columnLength = lockerWallData?.[selectedCabinets?.[0]]?.column ?? 0;

  const onSubmit = () => {
    const paymentData = sideAccessoriesData?.find((item) => item.type === "payment");
    if (!!paymentData && compartmentValue) {
      dispatch(
        addPayment({
          cabinetId: selectedCabinets[0],
          url: paymentData?.url ?? "",
          accessoryId: paymentData?.accessoryId ?? "",
          type: "payment",
          compartmentPosition: compartmentValue?.value,
          columnPosition: Number(columnValue?.value ?? 1),
        }),
      );
      const findPayment = Object.values(lockerWallData[selectedCabinets[0]]?.doors)?.some(
        (item) => !!item?.accessories?.payment,
      );
      if (!findPayment) {
        dispatch(
          addAccessoryData({
            keyniusPIMArticleId: paymentData?.accessoryId ?? "",
            articleName: "Payment",
            price: paymentData?.price ?? 0,
            quantity: 1,
          }),
        );
      }
    } else {
      toast.warning("Please select a payment type or position");
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
        const defaultValue = Object.keys(doorData).find((key) => doorData[key].accessories.payment);
        const defaultLabel = Object.values(doorData).findIndex((item) => item.accessories.payment) + 1;
        if (defaultLabel !== 0 && defaultValue) {
          setCompartmentValue({
            label: `${defaultLabel ?? "All"}`,
            value: `${defaultValue ?? ""}`,
          });
        }
        Object.values(doorData).forEach((item) => {
          if (item.accessories.payment) {
            setColumnValue({
              label: `${item.accessories.payment.columnPosition ?? "All"}`,
              value: `${item.accessories.payment.columnPosition ?? ""}`,
            });
          }
        });
      }
    }
  }, [selectedCabinets]);

  return (
    <div className={styles.wrapper}>
      <span className="text-12">{transText?.paymentLocationDescription}</span>
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
      <Button className={styles.button} label={transText?.placePayment} onClick={onSubmit} />
    </div>
  );
};

export default AccessoriesPaymentLocationPanel;
