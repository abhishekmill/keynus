"use client";

import React, { useState, useMemo } from "react";
import classNames from "classnames";

import Button from "../../../../ui/button";
import CustomDisclosure from "../../../../ui/disclosure";
import ProjectSubscriptionItem from "../_modules/subscriptionItem";
import { ICurrency, ISubscription, ISubscriptionArticle } from "@/utils/types";
import { euPriceFormat } from "../../../../../utils/functions";
import { useAppSelector } from "../../../../../utils/hooks/store";
import { projectSelector } from "../../../../../store/app";

import styles from "./style.module.scss";

type Props = {
  id: string;
  subscriptions: ISubscription[];
  lockerNumber: number;
  subscriptionArticleList?: ISubscriptionArticle[];
  transText: { [key: string]: string };
  currency?: ICurrency;
};

const ProjectSubscription: React.FC<Props> = ({
  id,
  subscriptions,
  lockerNumber,
  subscriptionArticleList = [],
  transText,
  currency,
}) => {
  const { discountStatus } = useAppSelector(projectSelector);
  const [addable, setAddable] = useState(false);
  const [subscriptionList, setSubScriptionList] = useState<ISubscription[]>(subscriptions);

  // Memoize the total calculation to ensure it updates correctly
  const subscriptionTotalPrice = useMemo(() => {
    return subscriptionList?.reduce((total, item) => {
      const lockers = item?.lockers ?? 0;
      const pricePerLocker = item?.pricePerLocker ?? 0;
      const discount = Math.max(0, Math.min(99, item?.discount ?? 0)); // Clamp discount
      const netPricePerLocker = pricePerLocker * (1 - discount / 100);
      const lineTotal = netPricePerLocker * lockers;

      return total + lineTotal;
    }, 0);
  }, [subscriptionList]);

  return (
    <div className={styles.wrapper}>
      <CustomDisclosure title={transText?.title} buttonStyle={styles.button} defaultOpen>
        <div className={styles.subContent}>
          <div className={styles.description}>
            <span>{transText?.description}</span>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <div className={styles.table}>
            <div className={styles.head}>
              <div className={styles.article}>{transText?.article}</div>
              <div className={styles.amount}>{transText?.lockers}</div>
              <div className={styles.price}>{transText?.pricePerLocker}</div>
              <div className={styles.discount}>{discountStatus ? transText?.discount : ""}</div>
              <div className={styles.netPrice}>{transText?.netPricePerLocker}</div>
              <div className={styles.subTotal}>{transText?.totalPerTerm}</div>
            </div>
            <div className={styles.body}>
              {subscriptionList.map((item, idx) => (
                <ProjectSubscriptionItem
                  key={item.id || idx} // Use id if available, fallback to index
                  lockerNum={lockerNumber}
                  projectId={id}
                  subscription={item}
                  subscriptionArticleList={subscriptionArticleList}
                  subscriptionList={subscriptionList}
                  setAddable={setAddable}
                  setSubScriptionList={setSubScriptionList}
                  currency={currency}
                  transText={transText}
                />
              ))}
              {addable && (
                <ProjectSubscriptionItem
                  key="new-subscription"
                  lockerNum={lockerNumber}
                  projectId={id}
                  subscriptionArticleList={subscriptionArticleList}
                  subscriptionList={subscriptionList}
                  transText={transText}
                  setAddable={setAddable}
                  setSubScriptionList={setSubScriptionList}
                  currency={currency}
                />
              )}
            </div>
            <div className={classNames(styles.head, styles.total)}>
              <div className={styles.article}></div>
              <div className={styles.amount}></div>
              <div className={styles.price}></div>
              <div className={styles.discount}></div>
              <div className={styles.netPrice}></div>
              <div className={styles.subTotal}>
                {currency?.symbol ?? "€"} {euPriceFormat(subscriptionTotalPrice)}
              </div>
            </div>
            <Button
              type="button"
              label={transText?.addSubscription}
              onClick={() => {
                setAddable(true);
              }}
              disabled={addable}
            />
          </div>
        </div>
      </CustomDisclosure>
    </div>
  );
};

export default ProjectSubscription;
