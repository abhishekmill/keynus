import React, { ReactNode } from "react";
import Image from "next/image";

import AppContainer from "../../../module/_basic/container";
import AuthBgPattern from "../../../../assets/image/authBgPattern.svg";

import styles from "./style.module.scss";

type Props = {
  children: ReactNode;
};

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <AppContainer className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image src="/logo.svg" alt="logo" width={350} height={250} priority />
        </div>
        <div className={styles.formWrapper}>
          <div className={styles.patternWrapper}>
            <AuthBgPattern className="h-full w-fit" />
          </div>
          <div className={styles.form}>{children}</div>
        </div>
      </AppContainer>
    </div>
  );
};

export default AuthLayout;
