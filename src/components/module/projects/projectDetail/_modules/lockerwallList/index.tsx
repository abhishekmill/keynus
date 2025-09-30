"use client";
import React from "react";
import { Accordion } from "@szhsin/react-accordion";

import LockerwallItem from "./modules/lockerwallItem";
import { ICurrency, ILockerwall, INumbering } from "@/utils/types";

import styles from "./style.module.scss";

type Props = {
  lockerwallList: ILockerwall[];
  numberingArticleList: INumbering[];
  currency?: ICurrency;
  transText?: { [key: string]: string };
};

const LockerwallList: React.FC<Props> = ({
  lockerwallList = [],
  numberingArticleList = [],
  transText = {},
  currency,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.lockerwallTableHeader}>
        <div className={styles.span2}></div>
        <div className={styles.span3}>{transText?.name}</div>
        <div className={styles.span3}>{transText?.location}</div>
        <div className={styles.span2}>{transText?.amountOfLockers}</div>
        <div className={styles.span2}>{transText?.price}</div>
      </div>
      <Accordion allowMultiple={true} defaultChecked transition transitionTimeout={250} className={styles.list}>
        {lockerwallList.map((lockerwall, idx) => (
          <LockerwallItem
            key={idx}
            lockerwall={lockerwall}
            numberingArticleList={numberingArticleList}
            transText={transText}
            currency={currency}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default LockerwallList;
