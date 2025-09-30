import React from "react";
import classNames from "classnames";

import styles from "./style.module.scss";

type Props = {
  message: string;
  variant?: "success" | "warn" | "error";
  className?: string;
};

const Alert: React.FC<Props> = ({ message, variant = "error", className = "" }) => {
  return (
    !!message && (
      <div
        className={classNames(styles.wrapper, className, {
          [styles.error]: variant === "error",
          [styles.warn]: variant === "warn",
          [styles.success]: variant === "success",
        })}
      >
        {message}
      </div>
    )
  );
};

export default Alert;
