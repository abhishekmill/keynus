import React, { Fragment } from "react";
import classNames from "classnames";
import { Menu, Transition } from "@headlessui/react";

import styles from "./style.module.scss";

type DropdownProps = {
  className?: string;
  children?: React.ReactNode;
  panel?: React.ReactNode;
  options?: { label: string; value: string }[];
};

const Dropdown: React.FC<DropdownProps> = ({ className = "", children, options = [], panel }) => {
  return (
    <Menu as="div" className={classNames(styles.wrapper, className)}>
      <Menu.Button aria-label="dropdown-button">{children}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        {options?.length > 0 ? (
          <Menu.Items className={styles.menuItems}>
            {options.map((item) => (
              <Menu.Item key={item.value}>
                {({ active }) => (
                  <button className={classNames(styles.menuItem, { [styles.active]: active })}>{item.label}</button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        ) : (
          <Menu.Items className={styles.menuItems}>{panel}</Menu.Items>
        )}
      </Transition>
    </Menu>
  );
};

export default Dropdown;
