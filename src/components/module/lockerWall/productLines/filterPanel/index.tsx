"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import CheckBoxFilterModule from "@/components/module/_basic/checkBoxFilterModule";
import SliderFilterModule from "@/components/module/_basic/sliderFilterModule";
import { usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import Icon from "../../../../ui/Icon";
import { IFilterType } from "../../../../../utils/types";
import { useArrayDebounce } from "../../../../../utils/hooks/useDebounce";

import styles from "./style.module.scss";

type CheckBoxSelection = Record<string, (string | number)[] | undefined>;

// Option 2: Create a specific type for lockerLine
interface ILockerLineType {
  displayName: string;
  id: string;
}

type Props = {
  transText: { [key: string]: string };
  branch?: IFilterType[];
  material?: IFilterType[];
  usecase?: IFilterType[];
  lockerLine?: ILockerLineType[];
  type?: "loading" | "default";
};

const LockerFilterPanel: React.FC<Props> = ({
  transText,
  material = [],
  usecase = [],
  lockerLine = [],
  type = "default",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialLoadedPath = useRef(false);

  const [showFilterOnMobile, setShowFilterOnMobile] = useState(false);
  const [selectedValueList, setSelectedValueList] = useState<CheckBoxSelection>({});
  const debouncedValue = useArrayDebounce(selectedValueList, 1500);
  // console.log("lockerLine", lockerLine);

  // Define dimension options based on your reference image
  const dimensionOptions = {
    width: [
      { label: "300mm", value: "300" },
      { label: "350mm", value: "350" },
      { label: "400mm", value: "400" },
      { label: "500mm", value: "500" },
    ],
    depth: [
      { label: "400mm", value: "400" },
      { label: "500mm", value: "500" },
      { label: "650mm", value: "650" },
      { label: "800mm", value: "800" },
      { label: "850mm", value: "850" },
    ],
  };

  // Helper function to convert checkbox values to range format
  const convertToRangeFormat = (key: string, values: (string | number)[]): string => {
    // For dimensions and numeric filters, convert to min_max format
    const numericFilters = ["width", "depth", "amountOfCompartments", "columns"];

    if (numericFilters.includes(key) && values.length > 0) {
      const numericValues = values.map((val) => (typeof val === "string" ? Number(val) : val)).sort((a, b) => a - b);
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      return `${min}_${max}`;
    }

    // For other filters (useCase, material, etc.), keep as joined values
    return values.join("_");
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const oldParamsString = params.toString();

    if (!initialLoadedPath.current) {
      initialLoadedPath.current = true;
      return;
    }

    Object.keys(debouncedValue).forEach((key) => {
      const values = debouncedValue[key];
      if (values && values.length > 0) {
        const formattedValue = convertToRangeFormat(key, values);
        params.set(key, formattedValue);
      } else {
        params.delete(key);
      }
    });

    if (oldParamsString !== params.toString()) {
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedValue, router, pathname, searchParams]);

  const onClearAll = () => {
    router.push(pathname);
  };

  return (
    <>
      <div className={classNames(styles.wrapper, { [styles.open]: showFilterOnMobile })}>
        <div className={styles.content}>
          <div className={styles.headerWrapper}>
            <h5 className={styles.heading}>{transText?.filter}</h5>
            <button onClick={onClearAll} className={styles.clearButton} aria-label="Clear all">
              <Icon name="ArrowCircle" className={styles.icon} />
            </button>
          </div>
          <div className={styles.formWrapper}>
            {/* <CheckBoxFilterModule
              name="branch"
              label={transText?.branch}
              options={branch.map((item) => ({ label: item.displayName, value: item.name }))}
            /> */}
            {/* <CheckBoxFilterModule
              name="useCase"
              label={transText?.useCase}
              options={usecase.map((item) => ({ label: item.displayName, value: item.name }))}
              checkBoxSelected={selectedValueList}
              setCheckBoxSelected={setSelectedValueList}
              moduleStatus={type}
            /> */}
            <CheckBoxFilterModule
              name="material"
              label={transText?.material}
              options={material.map((item) => ({ label: item.displayName, value: item.name }))}
              checkBoxSelected={selectedValueList}
              setCheckBoxSelected={setSelectedValueList}
              moduleStatus={type}
            />
            <CheckBoxFilterModule
              name="lockerLineCategory"
              label={transText?.lockerLineCategory}
              options={lockerLine.map((item: ILockerLineType) => ({
                label: item.displayName,
                value: item.id, // Now correctly using item.id
              }))}
              checkBoxSelected={selectedValueList}
              setCheckBoxSelected={setSelectedValueList}
              moduleStatus={type}
            />
            <CheckBoxFilterModule
              name="amountOfCompartments"
              label={transText?.amountOfCompartments}
              options={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
                { label: "6", value: "6" },
                { label: "7", value: "7" },
                { label: "8", value: "8" },
                { label: "9", value: "9" },
                { label: "10", value: "10" },
              ]}
              checkBoxSelected={selectedValueList}
              setCheckBoxSelected={setSelectedValueList}
              moduleStatus={type}
            />
            <CheckBoxFilterModule
              name="columns"
              label={transText?.columns}
              options={[
                { label: "1", value: "1" },
                { label: "2", value: "2" },
              ]}
              checkBoxSelected={selectedValueList}
              setCheckBoxSelected={setSelectedValueList}
              moduleStatus={type}
            />
          </div>
          <h5 className={styles.headingDimension}>{transText?.dimensions}</h5>
          <div className={styles.formWrapper}>
            {["width", "depth"].map((key) => (
              <CheckBoxFilterModule
                key={key}
                name={key}
                label={transText?.[key]}
                options={dimensionOptions[key as keyof typeof dimensionOptions]}
                checkBoxSelected={selectedValueList}
                setCheckBoxSelected={setSelectedValueList}
                moduleStatus={type}
              />
            ))}
          </div>
        </div>
      </div>
      <button type="button" className={styles.filterButton} onClick={() => setShowFilterOnMobile((prev) => !prev)}>
        {transText?.filter}
      </button>
    </>
  );
};

export default memo(LockerFilterPanel);
