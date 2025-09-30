"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { Tab } from "@headlessui/react";

import styles from "./style.module.scss";

type Props = {
  tabs: string[];
  panels: React.ReactNode[];
};

const AppTabs: React.FC<Props> = ({ tabs, panels }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <>
      <Tab.Group
        defaultIndex={0}
        selectedIndex={selectedIndex}
        onChange={(e) => {
          setSelectedIndex(e);
        }}
      >
        <Tab.List className={styles.list}>
          {tabs?.map((item, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                classNames(styles.tabItem, { [styles.active]: selected, [styles.noFirst]: idx !== 0 })
              }
            >
              {item}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={styles.panels}>
          {panels.map((panel, idx) => (
            <Tab.Panel key={idx} className={styles.panel}>
              {panel}
            </Tab.Panel>
          ))}
        </Tab.Panels>
        <div className={classNames(styles.list, "pt-10")}>
          {tabs?.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
              }}
              className={classNames(styles.tabItem, {
                [styles.active]: index === selectedIndex,
                [styles.noFirst]: index !== 0,
              })}
            >
              {item}
            </button>
          ))}
        </div>
      </Tab.Group>
    </>
  );
};

export default AppTabs;
