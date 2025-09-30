import React from "react";

import Selector from "../../../../../ui/selector";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
};

const AccessoriesPlinthsPanels: React.FC<Props> = ({ transText }) => {
  return (
    <div className={styles.wrapper}>
      <Selector
        value={{
          label: "All",
          value: "",
        }}
        label={transText?.plinths}
        setValue={() => {}}
        options={[]}
      />
    </div>
  );
};

export default AccessoriesPlinthsPanels;
