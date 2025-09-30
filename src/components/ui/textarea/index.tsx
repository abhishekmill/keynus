import React from "react";
import classNames from "classnames";
import { UseFormRegister } from "react-hook-form";

import styles from "./style.module.scss";

type Props = {
  name: string;
  label?: string;
  className?: string;
  rows?: number;
  register?: UseFormRegister<any>;
  errorMsg?: string;
};

const TextArea: React.FC<Props> = ({ name, label = "", className = "", rows = 4, register, errorMsg }) => {
  return (
    <div>
      <div className={classNames(styles.wrapper, className, { [styles.error]: !!errorMsg })}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea className={styles.textarea} rows={rows} {...(register && register(name))} />
      </div>
      {!!errorMsg && <span className={styles.error}>{errorMsg}</span>}
    </div>
  );
};

export default TextArea;
