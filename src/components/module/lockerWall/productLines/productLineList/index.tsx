"use client";
import React from "react";

import ProductLineItem from "./productLineItem";
import { ILockerWallSelector } from "@/utils/types";
import Pagination from "../../../_basic/pagination";

import styles from "./style.module.scss";

type Props = {
  id: string;
  lockerwallId: string;
  data: ILockerWallSelector[];
  totalLength: number;
  transText: { [key: string]: string };
};

const LockerList: React.FC<Props> = ({ transText, id, lockerwallId, data, totalLength }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchContainer}></div>

      {data.length > 0 ? (
        data.map((item, index) => (
          <ProductLineItem
            key={index}
            index={index}
            name={item.categoryName}
            projectId={id}
            cabinets={item.articleListToConfigureLockerWallResult}
            lockerWallId={lockerwallId}
            transText={transText}
          />
        ))
      ) : (
        <p className={styles.emptyMessage}>{transText?.noResult}</p>
      )}

      <div className="px-20">
        <Pagination transText={{ itemsPerPage: "items per page" }} length={totalLength} />
      </div>
    </div>
  );
};

export default LockerList;
