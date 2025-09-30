"use client";
import React from "react";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";

import Icon from "../../../../ui/Icon";
import { usePathname, useRouter } from "../../../../../navigation";

import styles from "./style.module.scss";

type Props = {
  name: string;
  label: string;
};

const SortableHeaderItem: React.FC<Props> = ({ label, name }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const order = searchParams.get("order") ?? "desc";
  const sortBy = searchParams.get("sortBy");

  const handleSort = () => {
    const params = new URLSearchParams(searchParams);

    params.set("sortBy", name);

    if (order === "desc") {
      params.set("order", "asc");
    } else {
      params.set("order", "desc");
    }

    // Redirect
    router.push(`${pathname}?${params?.toString()}`);
  };

  return (
    <div className={styles.wrapper}>
      {label}
      <button type="button" className={styles.sortButton} onClick={handleSort}>
        <Icon
          name="ChevronDown"
          className={classNames(styles.icon, { [styles.up]: order === "desc" && sortBy === name })}
        />
      </button>
    </div>
  );
};

export default SortableHeaderItem;
