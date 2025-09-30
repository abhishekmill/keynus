"use client";
import React, { InputHTMLAttributes, useState, useEffect } from "react";
import classNames from "classnames";
import { UseFormRegister } from "react-hook-form";

import Icon, { IconType } from "../Icon";

import styles from "./style.module.scss";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  className?: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  register?: UseFormRegister<any>;
  errorMsg?: string;
  icon?: IconType;
  required?: boolean;
  symbol?: string;
  symbolPosition?: "before" | "after";
};

const TextInput: React.FC<TextInputProps> = ({
  name,
  className = "",
  type = "text",
  label = "",
  register,
  errorMsg = "",
  icon,
  required = false,
  symbol,
  symbolPosition = "before",
  ...props
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div
        className={classNames(styles.wrapper, className, {
          [styles.error]: !!errorMsg,
          [styles.icon]: !!icon && isClient,
        })}
      >
        {" "}
        {!!label && (
          <label className={styles.label}>
            {label}
            {required ? <span className="text-danger">{` *`}</span> : ""}
          </label>
        )}
        {!!symbol && symbolPosition === "before" && <span>{symbol}</span>}
        <input
          type={type}
          className={classNames(styles.input, { [styles.symbolInput]: !!symbol })}
          {...(register && register(name))}
          {...props}
        />
        {!!symbol && symbolPosition === "after" && <span className="flex-1">{symbol}</span>}
        {!!icon && isClient && <Icon name={icon} className={styles.icon} />}
      </div>
      {!!errorMsg && <span className={styles.error}>{errorMsg}</span>}
    </div>
  );
};

export default TextInput;
