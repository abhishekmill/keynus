"use client";
import React from "react";
import classNames from "classnames";
import { Bars } from "react-loader-spinner";

import Icon, { IconType } from "../Icon";

import styles from "./style.module.scss";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  variant?: "outline" | "solid";
  color?: "primary" | "secondary" | "tertiary" | "danger" | "lightDanger";
  className?: string;
  label?: string;
  icon?: IconType;
  isLoading?: boolean;
  disabled?: boolean;
  isPrefix?: boolean;
  error?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Button: React.FC<ButtonProps> = ({
  type = "submit",
  variant = "solid",
  color = "primary",
  className = "",
  label = "",
  icon,
  isLoading = false,
  disabled = false,
  isPrefix = false,
  error = "",
  onClick,
}) => {
  return (
    <>
      <button
        type={type}
        {...(!!onClick && { onClick: onClick })}
        className={classNames(styles.wrapper, className, {
          [styles.outline]: variant === "outline",
          [styles.solid]: variant === "solid",
          [styles.primary]: color === "primary",
          [styles.secondary]: color === "secondary",
          [styles.tertiary]: color === "tertiary",
          [styles.danger]: color === "danger",
          [styles.lightDanger]: color === "lightDanger",
          [styles.disabled]: disabled,
        })}
        disabled={isLoading || disabled}
        aria-label={label === "" ? "button" : label}
      >
        {isLoading ? (
          <Bars height="20" width="80" color="white" ariaLabel="bars-loading" visible={true} />
        ) : (
          <>
            {icon && isPrefix && <Icon name={icon} className={styles.icon} />}
            {!!label && <span className={classNames({ [styles.hideOnMobile]: icon })}>{label}</span>}
            {icon && !isPrefix && <Icon name={icon} className={styles.icon} />}
          </>
        )}
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </>
  );
};

export default Button;
