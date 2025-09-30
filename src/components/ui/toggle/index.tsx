/* eslint-disable no-unused-vars */
import React from "react";
import classNames from "classnames";
import { Switch } from "@headlessui/react";

import styles from "./style.module.scss";

type Props = {
  defaultValue?: boolean;
  onChange: (val: boolean) => void;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  labelStyle?: string;
  switchStyle?: string;
};

const SwitchToggle: React.FC<Props> = ({
  onChange,
  defaultValue = false,
  prefix = "",
  suffix = "",
  disabled = false,
  labelStyle,
  switchStyle,
}) => {
  return (
    <div className={classNames(styles.wrapper, { [styles.disabled]: disabled })}>
      {prefix && <span className={classNames(styles.prefix, labelStyle)}>{prefix}</span>}
      <Switch
        checked={defaultValue}
        disabled={disabled}
        onChange={(val) => {
          onChange(val);
        }}
        className={classNames(styles.toggle, switchStyle, { [styles.enabled]: defaultValue })}
      >
        <span className="sr-only">Toggle Button</span>
        <span aria-hidden="true" className={classNames(styles.center, { [styles.enabled]: defaultValue })} />
      </Switch>
      {suffix && <span className={classNames(styles.suffix, labelStyle)}>{suffix}</span>}
    </div>
  );
};

export default SwitchToggle;
