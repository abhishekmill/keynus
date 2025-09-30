"use client";
import React from "react";

import styles from "./styles.module.scss";
import { Link } from "../../../navigation";
import Button from "../../ui/button";
import { useRouter } from "nextjs-toploader/app";

const ErrorScreen = ({ message }: { message?: string }) => {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Error</h1>
        <h5 className={styles.description}>{message ?? "Something went wrong"}</h5>
        <div className={styles.linkWrapper}>
          <Link
            href="/"
            onClick={() => {
              router.back();
            }}
          >
            <Button label="Go back" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
