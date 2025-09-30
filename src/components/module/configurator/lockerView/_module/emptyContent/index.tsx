"use client";
import React from "react";
import dynamic from "next/dynamic";

import { setMethod } from "../../../../../../store/configuratorControl";
import { useAppDispatch } from "../../../../../../utils/hooks/store";
import { Link, usePathname } from "../../../../../../navigation";

import styles from "./styles.module.scss";

const Button = dynamic(() => import("@/components/ui/button"), {
  ssr: false,
});

type Props = {
  transText?: { [key: string]: string };
};

const EmptyContent = ({ transText }: Props) => {
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  return (
    <div className={styles.emptyContent}>
      <p className={styles.emptyContentText}>{transText?.nothingHereYet}</p>
      <p className={styles.emptyContentText}>{transText?.addingColumn}</p>
      <Link href={`${pathName.split("/").slice(0, -1).join("/")}/list`} className={styles.selectColumnButton}>
        <Button
          type="button"
          label={transText?.selectColumn}
          onClick={() => {
            dispatch(setMethod("reset"));
          }}
        />
      </Link>
    </div>
  );
};

export default EmptyContent;
