"use client";

import React, { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";

const RadioButton = dynamic(() => import("../../../ui/radioButton"), {
  ssr: false,
});
const SwitchToggle = dynamic(() => import("../../../ui/toggle"), {
  ssr: false,
});
const NumberPanel = dynamic(() => import("./numberPanel"), {
  ssr: false,
});
import { configuratorControlSelector, setSelectionControl } from "@/store/configuratorControl";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/store";

import styles from "./style.module.scss";

type Props = {
  transText: { [key: string]: string };
};

const SelectionManagePanel: React.FC<Props> = ({ transText }) => {
  const dispatch = useAppDispatch();
  const { selectionControl } = useAppSelector(configuratorControlSelector);
  const { register, watch } = useForm();

  const selectionTypeWatch = watch("target");

  useEffect(() => {
    if (selectionTypeWatch) {
      dispatch(setSelectionControl({ ...selectionControl, selectionType: selectionTypeWatch }));
    }
  }, [selectionTypeWatch]);

  return (
    <form className={styles.wrapper}>
      <h4 className={styles.heading}>{transText?.groupSelection}</h4>
      <div className={styles.toggleItem}>
        <SwitchToggle
          defaultValue={selectionControl.isGroupSelection}
          prefix={transText?.off}
          suffix={transText?.on}
          labelStyle="text-12"
          switchStyle={styles.switchStyle}
          onChange={(val) => {
            dispatch(
              setSelectionControl({
                ...selectionControl,
                isGroupSelection: val,
              }),
            );
          }}
        />
      </div>
      <div className={styles.toggleItem}>
        <SwitchToggle
          defaultValue={selectionControl.selectionMode === "click"}
          prefix={transText?.drag}
          suffix={transText?.click}
          labelStyle="text-12"
          switchStyle={styles.switchStyle}
          onChange={(val) => {
            dispatch(setSelectionControl({ ...selectionControl, selectionMode: val ? "click" : "drag" }));
          }}
          disabled={!selectionControl.isGroupSelection}
        />
      </div>
      <div className={styles.radios}>
        <RadioButton
          name="target"
          value="cabinet"
          label={transText?.cabinets}
          defaultChecked={selectionControl.selectionType === "cabinet"}
          disabled={!selectionControl.isGroupSelection}
          register={register}
        />
        <RadioButton
          name="target"
          value="door"
          label={transText?.doors}
          defaultChecked={selectionControl.selectionType === "door"}
          disabled={!selectionControl.isGroupSelection}
          register={register}
        />
      </div>
      <NumberPanel transText={transText} />
    </form>
  );
};

export default memo(SelectionManagePanel);
