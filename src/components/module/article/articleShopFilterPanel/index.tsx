"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import CheckBoxFilterModule from "../../_basic/checkBoxFilterModule";
import { IArticleFilter } from "../../../../utils/types";
import { useArrayDebounce } from "../../../../utils/hooks/useDebounce";
import { usePathname } from "../../../../navigation";

import styles from "./style.module.scss";

// Add the CheckBoxSelection type to match the child component
type CheckBoxSelection = Record<string, (string | number)[] | undefined>;

type Props = {
  transText: { [key: string]: string };
  filterData: IArticleFilter;
};

const ArticleShopFilterPanel: React.FC<Props> = ({ transText, filterData }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialLoadedPath = useRef<any>();
  // Update the state type to match CheckBoxSelection
  const [selectedValueList, setSelectedValueList] = useState<CheckBoxSelection>({});

  const debouncedValue = useArrayDebounce(selectedValueList, 1500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const oldParamsString = params?.toString();
    if (!initialLoadedPath.current) {
      initialLoadedPath.current = true;
      return;
    }
    Object.keys(debouncedValue).forEach((key) => {
      if (debouncedValue?.[key]?.length > 0) {
        // Convert to string for URL params
        params.set(key, debouncedValue?.[key]?.map(String).join("_"));
      } else {
        params.delete(key);
      }
    });
    if (oldParamsString !== params?.toString()) {
      router.push(`${pathname}?${params?.toString()}`);
    }
  }, [debouncedValue]);

  return (
    <div className={styles.wrapper}>
      <h5 className={styles.heading}>Filter</h5>
      <div className={styles.options}>
        {Object.keys(filterData).map((keyName, index) => (
          <CheckBoxFilterModule
            key={index}
            name={keyName}
            label={transText[keyName]}
            options={filterData[keyName]?.map((item) => ({
              label: item.displayName,
              value: `${keyName}-${item.value}`,
            }))}
            checkBoxSelected={selectedValueList}
            setCheckBoxSelected={setSelectedValueList}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleShopFilterPanel;
