"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import classNames from "classnames";

import styles from "./style.module.scss";

import "react-calendar/dist/Calendar.css";

type Props = {
  label?: string;
  errorMsg?: string;
  value: Date | string;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: any) => void;
};

const DatePicker: React.FC<Props> = ({ label = "", errorMsg = "", value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={classNames(styles.inputWrapper, { [styles.error]: errorMsg })}
        onClick={() => setShowCalendar((prev) => !prev)}
      >
        <span className={styles.value}>{value ? format(value as Date, "dd/MM/yyyy") : ""}</span>
        {label && <span className={styles.label}>{label}</span>}
      </button>
      {showCalendar && (
        <div className={styles.calendarWrapper}>
          <Calendar
            onChange={(val) => {
              onChange(val);
              setShowCalendar(false);
            }}
            value={value}
          />
        </div>
      )}
      {errorMsg && <span className={styles.error}>{errorMsg}</span>}
    </div>
  );
};

export default DatePicker;
