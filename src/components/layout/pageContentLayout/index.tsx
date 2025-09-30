import React, { ReactNode } from "react";

import AppContainer from "../../module/_basic/container";

import styles from "./style.module.scss";
import classNames from "classnames";

type Props = {
  children: ReactNode;
  className?: string;
};

const PageContentLayout: React.FC<Props> = ({ children, className = "" }) => {
  return <AppContainer className={classNames(styles.wrapper, className)}>{children}</AppContainer>;
};

export default PageContentLayout;
