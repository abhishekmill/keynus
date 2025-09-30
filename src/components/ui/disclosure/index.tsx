"use client";
import React from "react";
import { Disclosure } from "@headlessui/react";

import classNames from "classnames";
import Icon, { IconType } from "../Icon";

import styles from "./style.module.scss";

type AccordionProps = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  buttonStyle?: string;
  panelStyle?: string;
  prefix?: IconType;
  defaultOpen?: boolean;
};

const CustomDisclosure: React.FC<AccordionProps> = ({
  title,
  children,
  className,
  buttonStyle,
  panelStyle,
  prefix,
  defaultOpen,
}) => {
  return (
    <div className={className}>
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className={classNames(styles.button, buttonStyle)}>
              <span className={classNames(styles.titleWrapper)}>
                {!!prefix && <Icon name={prefix} className={styles.prefix} />}
                {title}
              </span>
              <Icon name="ChevronDown" className={classNames(styles.icon, { [styles.open]: open })} />
            </Disclosure.Button>
            <Disclosure.Panel className={classNames(styles.panel, panelStyle)}>{children}</Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default CustomDisclosure;
