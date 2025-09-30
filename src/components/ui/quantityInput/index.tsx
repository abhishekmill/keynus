import React from "react";

import Button from "../button";

import styles from "./style.module.scss";

type Props = {
  label?: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  minimumValue?: number;
};

const QuantityInput: React.FC<Props> = ({ label = "", value = 0, setValue, minimumValue = 0 }) => {
  return (
    <div className={styles.wrapper}>
      {!!label && <span className={styles.label}>{label}</span>}
      <Button
        type="button"
        icon="Minus"
        disabled={value === minimumValue}
        onClick={() => {
          if (value > minimumValue) {
            setValue((prev) => prev - 1);
          }
        }}
      />
      <div className={styles.value}>
        <span>{value}</span>
      </div>
      <Button
        type="button"
        icon="Plus"
        onClick={() => {
          setValue((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default QuantityInput;
