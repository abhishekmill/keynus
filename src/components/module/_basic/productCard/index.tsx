import React from "react";
import classNames from "classnames";
import Skeleton from "react-loading-skeleton";

import styles from "./style.module.scss";

type Props = {
  label: string;
  price?: number;
  productId?: string;
  type?: "loading" | "default";
  children?: React.ReactNode;
  image: string;
  alt: string;
  aspectRatio?: string;
};

const ProductCard: React.FC<Props> = ({ label, price = 10, productId = "123", type = "default", children }) => {
  return (
    <div className={classNames(styles.wrapper, type === "default" && styles.default)}>
      {type === "loading" ? (
        <>
          <div className={styles.row}>
            <Skeleton width={100} height={20} />
          </div>
          <div className={styles.row}>
            <Skeleton width={60} height={20} />
          </div>
          <div className={styles.row}>
            <Skeleton width={80} height={20} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.row}>
            <span className={styles.label}>Name:</span>
            <span>{label}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Price:</span>
            <span>₹{price}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Product ID:</span>
            <span>{productId}</span>
          </div>
        </>
      )}
      {children}
    </div>
  );
};

export default ProductCard;
