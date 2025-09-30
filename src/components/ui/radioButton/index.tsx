import React from "react";
import classNames from "classnames";
import { UseFormRegister } from "react-hook-form";

import styles from "./style.module.scss";

type Props = {
  name: string;
  value: string;
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  register?: UseFormRegister<any>;
};

const RadioButton: React.FC<Props> = ({ label, value, name, defaultChecked = false, register, disabled = false }) => {
  return (
    <div className={styles.wrapper}>
      <input
        id={`${name}-${value}`}
        type="radio"
        name={name}
        value={value}
        className={styles.input}
        defaultChecked={defaultChecked}
        {...(register && register(name))}
        disabled={disabled}
      />
      <label htmlFor={`${name}-${value}`} className={classNames(styles.label, { [styles.disabled]: disabled })}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
