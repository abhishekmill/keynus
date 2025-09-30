"use client";
import React, { memo, useEffect, useState, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { useSearchParams } from "next/navigation";

import AppModal from "../modal";
import Button from "@/components/ui/button";
import CheckBox from "@/components/ui/checkBox";
import CustomDisclosure from "@/components/ui/disclosure";
import { TOption } from "@/components/ui/selector";

import styles from "./style.module.scss";

type CheckBoxSelection = Record<string, (string | number)[] | undefined>;

type Props = {
  name: string;
  label: string;
  options: TOption[];
  checkBoxSelected: CheckBoxSelection;
  setCheckBoxSelected: React.Dispatch<React.SetStateAction<CheckBoxSelection>>;
  moduleStatus?: "loading" | "default";
  useColumnLayout?: boolean;
  maxDisplayItems?: number;
  forceColumnLayoutFor?: string[]; // For specific field names that should always use columns
};

const CheckBoxFilterModule: React.FC<Props> = (props) => {
  const {
    name,
    label,
    options,
    checkBoxSelected,
    setCheckBoxSelected,
    moduleStatus = "default",
    useColumnLayout = false,
    maxDisplayItems = 5,
    forceColumnLayoutFor = ["amountOfCompartments"],
  } = props;

  const shouldUseColumnLayout = useColumnLayout || forceColumnLayoutFor.includes(name);
  const searchParams = useSearchParams();

  const [openModal, setOpenModal] = useState(false);

  const onSave = useCallback(() => {
    setOpenModal(false);
  }, []);

  const onClear = useCallback(() => {
    setCheckBoxSelected((prev) => ({ ...prev, [name]: [] }));
    setOpenModal(false);
  }, [name, setCheckBoxSelected]);

  const onCheckBoxEvent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, option: TOption) => {
      setCheckBoxSelected((prev: CheckBoxSelection) => {
        if (event.target.checked) {
          const currentSelection = prev[name] || [];
          return {
            ...prev,
            [name]: [option.value, ...currentSelection],
          };
        } else {
          const filteredArray = prev[name]?.filter((item: string | number) => item !== option.value) || [];
          return {
            ...prev,
            [name]: filteredArray,
          };
        }
      });
    },
    [name, setCheckBoxSelected],
  );

  // Initialize from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const paramsValue = params.get(name);

    if (paramsValue) {
      const filteredData = paramsValue.split("_").filter(Boolean);
      if (filteredData.length > 0) {
        setCheckBoxSelected((prev) => ({ ...prev, [name]: filteredData }));
      }
    }
  }, [searchParams, name, setCheckBoxSelected]);

  // Determine which options to display
  const displayOptions = shouldUseColumnLayout ? options : options.slice(0, maxDisplayItems);
  const showMoreButton = !shouldUseColumnLayout && options.length > maxDisplayItems;
  const selectedCount = checkBoxSelected[name]?.length ?? 0;

  // Column layout styles
  const columnLayoutStyles = shouldUseColumnLayout
    ? {
        display: "grid" as const,
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "8px 16px",
      }
    : {};

  return (
    <>
      <CustomDisclosure
        title={label}
        className={styles.wrapper}
        buttonStyle={styles.button}
        panelStyle={styles.panel}
        defaultOpen={true}
      >
        <p className={styles.currentStatus}>
          {selectedCount === 0
            ? "No items selected"
            : `${selectedCount} item${selectedCount === 1 ? "" : "s"} selected`}
        </p>

        <div
          className={`${styles.checkBoxes} ${shouldUseColumnLayout ? styles.columnsLayout : ""}`}
          style={columnLayoutStyles}
        >
          {moduleStatus === "loading" ? (
            <Skeleton className="w-2/3" />
          ) : (
            displayOptions.map((option, index) => (
              <CheckBox
                key={`${option.value}-${index}`}
                name={name}
                value={option.value}
                label={option.label}
                checked={!!checkBoxSelected[name]?.includes(option.value)}
                onChange={(event) => onCheckBoxEvent(event, option)}
              />
            ))
          )}
        </div>

        {showMoreButton && (
          <button type="button" className={styles.moreButton} onClick={() => setOpenModal(true)}>
            Show more
          </button>
        )}
      </CustomDisclosure>

      <AppModal isOpen={openModal} size="lg" setIsOpen={setOpenModal}>
        <div className={styles.modalContents}>
          <h1 className={styles.heading}>{label}</h1>

          <div className={styles.modalList}>
            {options.map((option, index) => (
              <CheckBox
                key={`${option.value}-${index}`}
                name={name}
                value={option.value}
                label={option.label}
                checked={!!checkBoxSelected[name]?.includes(option.value)}
                onChange={(event) => onCheckBoxEvent(event, option)}
              />
            ))}
          </div>

          <div className={styles.buttonWrapper}>
            <Button label="Clear all" color="danger" className={styles.clearButton} onClick={onClear} />
            <Button label="Save" className={styles.button} onClick={onSave} />
          </div>
        </div>
      </AppModal>
    </>
  );
};

export default memo(CheckBoxFilterModule);
