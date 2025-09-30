import React from "react";

import styles from "./style.module.scss";

type Props = {
  name: string;
  value: string | number;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
};

const CheckBox: React.FC<Props> = ({ name, label = "", value = "", checked = false, onChange = () => {} }) => {
  return (
    <div className={styles.wrapper}>
      <input
        type="checkbox"
        id={`checkbox-${value}`}
        name={name}
        value={value}
        checked={checked}
        className={styles.checkbox}
        onChange={onChange}
      />
      <div className={styles.checkMark}></div>
      <label htmlFor={`checkbox-${value}`} className={styles.label}>
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
