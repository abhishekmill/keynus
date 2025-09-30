"use client";

import React from "react";
import classNames from "classnames";
import styles from "./style.module.scss";
import Icon from "@/components/ui/Icon";

// Define the sortable fields based on your API request structure
export type SortableField =
  | "categoryName"
  | "articleName"
  | "customArticleName"
  | "height"
  | "width"
  | "depth"
  | "compartments";

type Props = {
  label: string;
  name: SortableField;
  active: boolean;
  isDescending?: boolean;
  onSort: (field: SortableField, isDescending: boolean) => void;
  className?: string;
};

const ProductSortableHeader: React.FC<Props> = ({ label, name, active, isDescending = false, onSort, className }) => {
  const handleSort = React.useCallback(() => {
    // If not currently active, start with ascending (isDescending = false)
    // If currently active, toggle the direction
    const newIsDescending = active ? !isDescending : false;
    onSort(name, newIsDescending);
  }, [name, active, isDescending, onSort]);

  return (
    <div className={classNames(styles.wrapper, className)}>
      {label}
      <button
        type="button"
        className={classNames(styles.sortButton, {
          [styles.active]: active,
        })}
        onClick={handleSort}
        aria-label={`Sort by ${label} ${active ? (isDescending ? "descending" : "ascending") : "ascending"}`}
        aria-pressed={active}
      >
        <Icon
          name="ChevronDown"
          className={classNames(styles.icon, {
            [styles.up]: active && !isDescending,
            [styles.down]: active && isDescending,
            [styles.inactive]: !active,
          })}
        />
      </button>
    </div>
  );
};

export default ProductSortableHeader;
