"use client";
import React, { memo, useEffect, useState } from "react";

import Icon from "../../../ui/Icon";
import { useAppSelector } from "../../../../utils/hooks/store";
import { configuratorSelector } from "../../../../store/configurator";
import { euPriceFormat } from "../../../../utils/functions";
import { accessoriesSelector } from "../../../../store/accessories";

import styles from "./style.module.scss";

type Props = {
  transText?: { [key: string]: string };
};

const PricePanel: React.FC<Props> = ({ transText }) => {
  const { lockerWallData, currency } = useAppSelector(configuratorSelector);
  const { accessoriesData } = useAppSelector(accessoriesSelector);
  const [isShow, setIsShow] = useState(true);
  const [expand, setExpand] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const lockerPrice = Object.values(lockerWallData)
      .map((item) => item.price)
      .reduce((total = 0, onePrice) => total + onePrice, 0);
    const accessoriesPrice = accessoriesData
      .map((item) => (item.price ?? 0) * item.quantity)
      .reduce((total = 0, onePrice) => total + onePrice, 0);
    setTotalPrice(lockerPrice + accessoriesPrice);
  }, [lockerWallData, accessoriesData]);

  return (
    isShow && (
      <div className={styles.wrapper}>
        <h4>{transText?.price}</h4>
        {expand && (
          <div className={styles.expandPanel}>
            <div className={styles.list}>
              {Object.values(lockerWallData)?.map((item, index) => (
                <div className={styles.listItem} key={index}>
                  <span className={styles.label}>{`Cabinet ${index + 1}`}</span>
                  <span className={styles.value}>
                    {currency.symbol ?? "€"} {item?.price ? euPriceFormat(item.price) : 0}
                  </span>
                </div>
              ))}
              {accessoriesData.map((accessory, index) => (
                <div className={styles.listItem} key={index}>
                  <span
                    className={styles.label}
                  >{`${accessory.quantity > 1 ? accessory.quantity + " x " : ""} ${accessory.articleName}`}</span>
                  <span className={styles.value}>
                    {currency.symbol ?? "€"}{" "}
                    {accessory ? euPriceFormat((accessory?.price ?? 0) * (accessory?.quantity ?? 0)) : 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.total}>
          {transText?.total}{" "}
          <span className={styles.price}>
            {currency.symbol ?? "€"} {euPriceFormat(totalPrice)}
          </span>
        </div>
        <button className={styles.expandButton} onClick={() => setExpand((prev) => !prev)} aria-label="expand button">
          <Icon name={expand ? "ArrowsPointingIn" : "ArrowsPointingOut"} className={styles.icon} />
        </button>
        <button className={styles.closeButton} onClick={() => setIsShow(false)} aria-label="close button">
          <Icon name="XMark" className={styles.icon} />
        </button>
      </div>
    )
  );
};

export default memo(PricePanel);
