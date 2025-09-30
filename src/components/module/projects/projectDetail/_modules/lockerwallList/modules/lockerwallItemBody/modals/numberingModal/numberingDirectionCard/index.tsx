import React from "react";

import VerticalImage from "@/assets/image/verticalNumbering.svg";
import HorizontalImage from "@/assets/image/horizontalNumbering.svg";

import styles from "./styles.module.scss";
import classNames from "classnames";

type Props = {
  value: "vertical" | "horizontal";
  label: "Vertical" | "Horizontal";
  register: any;
  active: "vertical" | "horizontal";
};

const NumberingDirectionCard: React.FC<Props> = ({
  value = "horizontal",
  label = "Vertical",
  register = {},
  active = "vertical",
}) => {
  return (
    <div className={classNames(styles.wrapper, { [styles.horizontalWrapper]: active !== value })}>
      <label htmlFor={`selector-${value}`} className="cursor-pointer">
        <div className={styles.selection}>
          <input
            type="radio"
            name="direction"
            value={value}
            id={`selector-${value}`}
            className={classNames(styles.input, { [styles.checked]: value === active })}
            {...register}
            defaultChecked={value === "vertical"}
          />
          <p className={styles.label}>{label}</p>
        </div>
        <div className={styles.imageContent}>
          {value === "vertical" ? (
            <VerticalImage className={classNames(styles.image, { [styles.activeImage]: value !== active })} />
          ) : (
            <HorizontalImage className={classNames(styles.image, { [styles.activeImage]: value !== active })} />
          )}
        </div>
      </label>
    </div>
  );
};

export default NumberingDirectionCard;
