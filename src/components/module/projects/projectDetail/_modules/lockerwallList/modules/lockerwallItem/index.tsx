"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { ICurrency, ILockerwall, INumbering } from "../../../../../../../../utils/types";
import { AccordionItem as Item } from "@szhsin/react-accordion";
import LockerwallItemHeader from "../lockerwallItemHeader";
import { euPriceFormat } from "../../../../../../../../utils/functions";

const LockerwallItemBody = dynamic(() => import("../lockerwallItemBody"), {
  ssr: false,
});

type Props = {
  lockerwall: ILockerwall;
  numberingArticleList: INumbering[];
  transText: {
    [key: string]: string;
  };
  currency?: ICurrency;
};

const LockerwallItem: React.FC<Props> = ({ lockerwall, numberingArticleList, currency, transText }) => {
  const [lockerNum, setLockerNum] = useState(0);
  const [lockerSumPrice, setLockerSumPrice] = useState<number>();

  console.log("lockerSumPrice", lockerSumPrice);

  // Helper function to safely parse numbers and avoid NaN
  const safeParseNumber = (value: string | number, fallback: number = 0): number => {
    const parsed = typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
    return isNaN(parsed) ? fallback : parsed;
  };

  // Helper function to calculate item total price
  const calculateItemTotalPrice = (item: any): number => {
    const amount = safeParseNumber(item?.amount, 0);
    const pricePerUnit = safeParseNumber(item?.pricePerUnit, 0);
    const discount = safeParseNumber(item?.discount, 0);

    // Calculate net price per unit from discount if not provided
    const providedNetPrice = safeParseNumber(
      item?.netPricePerUnit ?? item?.netPricerPerUnit ?? item?.netPrice ?? item?.net_price_per_unit,
      0,
    );

    // If pricePerUnit is 0, use the provided net price
    if (pricePerUnit === 0) {
      return providedNetPrice * amount;
    } else {
      // If pricePerUnit exists, calculate from discount
      // This ensures we use the most up-to-date discount value
      const calculatedNetPrice = pricePerUnit * (1 - discount / 100);
      return calculatedNetPrice * amount;
    }
  };

  useEffect(() => {
    const lockerwallJson = JSON.parse(lockerwall.configuration3DJson);
    let lockers = 0;
    if (lockerwallJson && typeof lockerwallJson === "object") {
      const lockerNumberArray = Object.keys(lockerwallJson).map(
        (key) => Object.keys(lockerwallJson[key]?.doors).length * (lockerwallJson[key]?.column ?? 1),
      );
      lockers = lockerNumberArray.reduce((total, lockerNum) => total + lockerNum, 0);
    }
    setLockerNum(lockers);

    if (lockerwall?.articles && lockerwall?.articles?.length > 0) {
      const articleTotalPrice = lockerwall.articles.map((item: any) => {
        return Number(calculateItemTotalPrice(item).toFixed(2));
      });

      setLockerSumPrice(articleTotalPrice?.reduce((total = 0, row: any) => total + Number(row), 0) ?? 0.0);
    }
  }, [lockerwall]);

  return (
    <Item
      header={({ state }) => (
        <LockerwallItemHeader
          title={lockerwall.lockerWallName}
          location={lockerwall?.floor}
          amountOfLockers={lockerNum}
          priceOfLockers={euPriceFormat(lockerSumPrice)}
          previewImage={lockerwall?.imageURL}
          transText={transText}
          isOpen={state.isEnter}
          currency={currency}
        />
      )}
      initialEntered={false}
      translate="yes"
    >
      <LockerwallItemBody
        lockerwall={lockerwall}
        numberingArticleList={numberingArticleList}
        lockerSumPrice={lockerSumPrice ?? 0.0}
        currency={currency}
        transText={transText}
      />
    </Item>
  );
};

export default LockerwallItem;
