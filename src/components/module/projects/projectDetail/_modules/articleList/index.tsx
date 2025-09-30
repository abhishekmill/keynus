"use client";
import React, { useState } from "react";
import classNames from "classnames";
import dynamic from "next/dynamic";

import ProjectArticleItem from "../articleItem";
import { IArticleNote, ICurrency } from "../../../../../../utils/types";
import { useAppSelector } from "../../../../../../utils/hooks/store";
import { projectSelector } from "../../../../../../store/app";
import { euPriceFormat } from "../../../../../../utils/functions";

const ArticleNoteModel = dynamic(() => import("./articleNoteModel"), { ssr: false });

import styles from "./style.module.scss";

type Props = {
  articleList: any; //IProjectAddOn[] | ILockerwallArticle[]
  totalPrice: number;
  currency?: ICurrency;
  lockerwallId?: string;
  articleType: "lockerwallArticle" | "article";
  projectId: string;
  transText: { [key: string]: string };
};

const ProjectArticleList: React.FC<Props> = ({
  articleList,
  totalPrice,
  lockerwallId,
  currency,
  articleType,
  projectId,
  transText,
}) => {
  const { discountStatus } = useAppSelector(projectSelector);
  const [selectedArticle, setSelectedArticle] = useState<IArticleNote>();

  console.log("from projectdetail", articleList);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <div className={styles.table}>
          <div className={styles.head}>
            <div className={styles.article}>{transText?.article}</div>
            <div className={styles.color}>{articleType === "article" ? transText?.color : ""}</div>
            <div className={styles.amount}>{transText?.amount}</div>
            <div className={styles.price}>{transText?.pricePerUnit}</div>
            <div className={styles.discount}>{discountStatus ? transText?.discount : ""}</div>
            <div className={styles.netPrice}>{transText?.netPricePerUnit}</div>
            <div className={styles.subTotal}>{transText?.priceSubtotal}</div>
          </div>
          <div className={styles.body}>
            {articleList?.map((item: any, idx: number) => (
              <ProjectArticleItem
                key={idx}
                id={item.id}
                lockerwallId={lockerwallId}
                articleId={articleType === "lockerwallArticle" ? item?.articleId : item?.keyniusPIMArticleId}
                article={
                  item.customArticleName ??
                  item.keyniusPIMArticle?.customArticleName ??
                  item.keyniusPIMArticle?.articleName ??
                  item.articleName ??
                  ""
                }
                articleType={item?.articleType ?? item?.addOnType}
                pricePerUnit={item.pricePerUnit ?? ""}
                discount={item.discount ?? ""}
                // netPricerPerUnit={item.pricePerUnit ?? (item?.pricePerUnit ?? 0) * (1 - (item?.discount ?? 0) / 100)}
                netPricerPerUnit={(item?.pricePerUnit ?? 0) * (1 - (item?.discount ?? 0) / 100)}
                quantity={item.quantity ?? item.amount}
                color={item.keyniusPIMArticleColor?.textureUrl}
                transText={transText}
                currency={currency}
                type={articleType}
                note={item.notes}
                isNumberingArticle={item?.accessoryType === "numberingTypeReference"}
                setSelectedArticle={setSelectedArticle}
              />
            ))}
          </div>
          <div className={classNames(styles.head, styles.total)}>
            <div className={styles.article}></div>
            <div className={styles.color}></div>
            <div className={styles.amount}></div>
            <div className={styles.price}></div>
            <div className={styles.discount}></div>
            <div className={styles.netPrice}></div>
            <div className={styles.subTotal}>{`${currency?.symbol ?? "€"} ${euPriceFormat(totalPrice)}`}</div>
          </div>
        </div>
      </div>
      {!!selectedArticle && (
        <ArticleNoteModel
          selectedArticle={selectedArticle}
          projectId={projectId}
          setSelectedArticle={setSelectedArticle}
          transText={transText}
        />
      )}
    </div>
  );
};

export default ProjectArticleList;
