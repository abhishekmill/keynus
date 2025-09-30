import React from "react";

import AppCarousel from "../../_basic/carousel";
import ProductCard from "../../_basic/productCard";

import styles from "./style.module.scss";

const dummyArticleGroupData = [
  { id: 0, name: "Article group" },
  { id: 1, name: "Article group" },
  { id: 2, name: "Article group" },
  { id: 3, name: "Article group" },
  { id: 4, name: "Article group" },
  { id: 5, name: "Article group" },
  { id: 6, name: "Article group" },
  { id: 7, name: "Article group" },
  { id: 8, name: "Article group" },
  { id: 9, name: "Article group" },
  { id: 10, name: "Article group" },
  { id: 11, name: "Article group" },
];

const ArticleGroupSelector = () => {
  return (
    <div className={styles.wrapper}>
      <AppCarousel>
        {dummyArticleGroupData.map((item, index) => (
          <div key={index} className={styles.item}>
            <ProductCard
              key={index}
              label={item.name}
              image="/preview/sample_locker.webp"
              alt={`ArticleGroup-${item.name}`}
            />
          </div>
        ))}
      </AppCarousel>
    </div>
  );
};

export default ArticleGroupSelector;
