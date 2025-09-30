"use client";

import React from "react";
import classNames from "classnames";
import Icon from "../../../../ui/Icon";
import styles from "./style.module.scss";

type Props = {
  label: string;
  name: string;
  active: boolean;
  order?: "asc" | "desc";
  onSort: (name: string) => void;
};

const ArticleSortableHeaderItem: React.FC<Props> = ({ label, name, active, order, onSort }) => {
  const isDescending = order === "desc";
  const isAscending = order === "asc";

  const handleSort = React.useCallback(() => {
    onSort(name);
  }, [name, onSort]);

  return (
    <div className={styles.wrapper}>
      {label}
      <button
        type="button"
        className={classNames(styles.sortButton, {
          [styles.active]: active,
        })}
        onClick={handleSort}
        aria-label={`Sort by ${label} ${active ? (isDescending ? "ascending" : "descending") : ""}`}
        aria-pressed={active}
      >
        <Icon
          name="ChevronDown"
          className={classNames(styles.icon, {
            [styles.up]: active && isDescending,
            [styles.down]: active && isAscending,
            [styles.inactive]: !active,
          })}
        />
      </button>
    </div>
  );
};

export default ArticleSortableHeaderItem;
