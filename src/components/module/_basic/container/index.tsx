import React, { ReactNode } from "react";

import styles from "./style.module.scss";
import classNames from "classnames";

type AppContainerProps = {
  children: ReactNode;
  className?: string;
};

const AppContainer: React.FC<AppContainerProps> = ({ children, className }) => {
  return <div className={classNames(styles.wrapper, className)}>{children}</div>;
};

export default AppContainer;
