"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import { useSearchParams } from "next/navigation";

import CustomDisclosure from "@/components/ui/disclosure";
import { useArrayDebounce } from "../../../../utils/hooks/useDebounce";

import styles from "./style.module.scss";

type Props = {
  name: string;
  label: string;
  defaultStart?: number;
  defaultEnd?: number;
  maxValue?: number;
  minValue?: number;
  step?: number;
  setSelectedRange: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string[] | undefined;
    }>
  >;
};

const SliderFilterModule: React.FC<Props> = ({
  name,
  label,
  defaultStart = 0,
  defaultEnd = 30,
  minValue = 0,
  maxValue = 30,
  step = 5,
  setSelectedRange,
}) => {
  const searchParams = useSearchParams();
  const paramsValue = searchParams.get(name);
  const initialLoadedPath = useRef(false);

  const [value, setValue] = useState<{ start: number; end: number }>({
    start: paramsValue ? +paramsValue?.split("_")?.[0] : defaultStart,
    end: paramsValue ? +paramsValue?.split("_")?.[1] : defaultEnd,
  });

  const rangeDebounce = useArrayDebounce(value, 500);

  useEffect(() => {
    if (!initialLoadedPath.current) {
      initialLoadedPath.current = true;
      return;
    }

    setSelectedRange((prev) => ({
      ...prev,
      [name]: [value.start?.toString(), value.end?.toString()],
      page: ["1"],
    }));
  }, [rangeDebounce]);

  return (
    <CustomDisclosure
      title={label}
      className={styles.wrapper}
      buttonStyle={styles.button}
      panelStyle={styles.panel}
      defaultOpen={true}
    >
      <div className={styles.inputWrapper}>
        <input
          type="number"
          className={styles.input}
          value={+value.start}
          onChange={(event) => {
            setValue((prev) => ({ ...prev, start: +event.target.value }));
          }}
        />
        <div className={styles.line}></div>
        <input
          type="number"
          className={styles.input}
          value={+value.end}
          onChange={(event) => {
            setValue((prev) => ({ ...prev, end: +event.target.value }));
          }}
        />
      </div>
      <MultiRangeSlider
        className={styles.slider}
        min={minValue}
        max={maxValue}
        step={step}
        ruler={false}
        label={false}
        preventWheel={false}
        thumbLeftColor="#54CA70"
        thumbRightColor="#54CA70"
        barInnerColor="#54CA70"
        minValue={value.start}
        maxValue={value.end}
        onInput={(e: any) => {
          if (e.minValue !== value.start || e.maxValue !== value.end) {
            setValue({ start: e.minValue, end: e.maxValue });
          }
        }}
      />
    </CustomDisclosure>
  );
};

export default memo(SliderFilterModule);
