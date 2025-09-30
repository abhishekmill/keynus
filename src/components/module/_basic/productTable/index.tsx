"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import styles from "./style.module.scss";
import ArticleSortableHeaderItem from "../table/articleSortableHeaderItem";

type Product = {
  label: string;
  articleId: string;
  articleNumber: string;
  price: number;
  currencySymbol: string;
  productId: string;
};

type Props = {
  data: Product[];
  projectId: string;
};

const ProductTable: React.FC<Props> = ({ data, projectId }) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<keyof Product>("label");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof Product) => {
    if (sortBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortBy, order]);

  const handleRowClick = (id: string) => {
    router.push(`/projects/${projectId}/articles/${id}`);
  };

  return sortedData.length > 0 ? (
    <div className={styles.wrapper}>
      <div className={styles.tHeader}>
        <div className={classNames(styles.th, styles.span3)}>
          <ArticleSortableHeaderItem
            name="label"
            label="Article Name"
            active={sortBy === "label"}
            order={order}
            onSort={() => handleSort("label")}
          />
        </div>
        <div className={classNames(styles.th, styles.span2)}>
          <ArticleSortableHeaderItem
            name="articleNumber"
            label="Article Number"
            active={sortBy === "articleNumber"}
            order={order}
            onSort={() => handleSort("articleNumber")}
          />
        </div>
        <div className={classNames(styles.th, styles.span1)}>
          <ArticleSortableHeaderItem
            name="price"
            label="Price"
            active={sortBy === "price"}
            order={order}
            onSort={() => handleSort("price")}
          />
        </div>
      </div>

      {sortedData.map((product) => (
        <div
          key={product.productId}
          className={styles.tr}
          onClick={() => handleRowClick(product.productId)}
          style={{ cursor: "pointer" }}
        >
          <div className={classNames(styles.td, styles.span3)}>{product.label}</div>
          <div className={classNames(styles.td, styles.span2)}>{product.articleNumber}</div>
          <div className={classNames(styles.td, styles.span1)}>
            {product.currencySymbol} {product.price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className={styles.blankDataWrapper}>
      <div className={styles.message}>No articles found for this project.</div>
    </div>
  );
};

export default ProductTable;
