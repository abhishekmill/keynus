import React, { Fragment } from "react";
import classNames from "classnames";
import { Listbox, Transition } from "@headlessui/react";
import { TypeAnimation } from "react-type-animation";

import Icon from "../Icon";

import styles from "./style.module.scss";

export type TOption = { label: string; value: string | number };

type SelectorProps = {
  label?: string;
  className?: string;
  value: TOption;
  setValue: React.Dispatch<TOption>;
  options: TOption[];
  errorMsg?: string;
  required?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
};

const Selector: React.FC<SelectorProps> = ({
  options = [],
  label = "",
  className = "",
  value,
  setValue,
  errorMsg = "",
  required = false,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <div className={classNames(styles.wrapper, className, { [styles.disabled]: disabled && !isLoading })}>
      <Listbox value={value} onChange={setValue} disabled={disabled}>
        <div className={styles.content}>
          {!!label && (
            <label
              className={classNames(
                styles.selectorLabel,
                { [styles.error]: errorMsg },
                { [styles.disabled]: disabled && !isLoading },
              )}
            >
              {label}
              {required ? <span className="text-danger">{` *`}</span> : ""}
            </label>
          )}
          <Listbox.Button
            className={classNames(styles.button, { [styles.error]: errorMsg, [styles.hasLabel]: !!label })}
          >
            <span className={classNames(styles.label, { [styles.disabled]: disabled && !isLoading })}>
              {isLoading ? (
                <span className="text-darkGray text-14">
                  Loading
                  <TypeAnimation
                    sequence={["", 300, ".", 300, "..", 300, "...", 300]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    cursor={false}
                  />
                </span>
              ) : (
                value?.label
              )}
            </span>
            <span className={styles.iconWrapper}>
              <Icon name="ChevronDown" className={styles.icon} />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className={styles.options}>
              {options.map((item, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    classNames(active ? "bg-primary text-white" : "text-gray-900", styles.option)
                  }
                  value={item}
                >
                  {item.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {!!errorMsg && <span className={styles.error}>{errorMsg}</span>}
    </div>
  );
};

export default Selector;
