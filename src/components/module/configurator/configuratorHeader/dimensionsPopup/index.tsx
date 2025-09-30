import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import RadioButton from "../../../../ui/radioButton";

import styles from "./style.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../../utils/hooks/store";
import {
  configuratorControlSelector,
  setDimensions,
  setShowCameraControlPanel,
} from "../../../../../store/configuratorControl";
import SwitchToggle from "../../../../ui/toggle";

type Props = {
  transText?: { [key: string]: string };
};

const DimensionPopUp: React.FC<Props> = ({ transText }) => {
  const dispatch = useAppDispatch();
  const { dimensions, showCameraControlPanel } = useAppSelector(configuratorControlSelector);
  const { register, watch } = useForm({});
  const dimensionWatch = watch("dimension");

  useEffect(() => {
    dispatch(setDimensions(dimensionWatch));
  }, [dimensionWatch]);

  return (
    <div className={styles.wrapper}>
      <h5>{transText?.toggleDimensions}</h5>
      <div className={styles.radioWrapper}>
        <RadioButton
          register={register}
          name="dimension"
          value="metric"
          label="Metric"
          defaultChecked={dimensions === "metric"}
        />
        <RadioButton
          register={register}
          name="dimension"
          value="imperial"
          label="Imperial"
          defaultChecked={dimensions === "imperial"}
        />
        <div className={styles.viewControl}>
          <span className={styles.label}>Show camera controls</span>
          <div className={styles.controlWrapper}>
            <span>Off</span>
            <SwitchToggle
              defaultValue={showCameraControlPanel}
              onChange={(val) => {
                dispatch(setShowCameraControlPanel(val));
              }}
            />
            <span>On</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionPopUp;
