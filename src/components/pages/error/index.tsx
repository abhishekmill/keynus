import React from "react";
import Link from "next/link";

import Button from "../../ui/button";

import styles from "./style.module.scss";

type Props = {
  message?: string;
  reset: () => void;
};

const ErrorPage: React.FC<Props> = ({ message, reset }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Error</h1>
        <h5 className={styles.description}>{message}</h5>
        <div className={styles.linkWrapper}>
          <Link href="/" onClick={reset}>
            <Button label="Go back" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
