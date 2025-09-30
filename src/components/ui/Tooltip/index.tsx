import classNames from "classnames";

import styles from "./styles.module.scss";

interface IProps {
  message: string | React.ReactNode;
  position?: "left" | "center" | "right" | "bottom" | "top" | "bottomLeft" | "bottomRight";
  children: React.ReactNode;
  wrapperClass?: string;
}

export default function Tooltip({ message, position = "bottom", wrapperClass, children }: Readonly<IProps>) {
  const getWrapperClassByPosition = () => {
    switch (position) {
      case "left":
        return "right-0 pl-3 -mr-1.5";
      case "right":
        return "left-0 pr-3 -ml-1.5";
      case "top":
        return "-top-70";
      case "bottom":
        return "pb-20 -bottom-60 -mb-5";
      case "bottomLeft":
        return "pb-20 -bottom-60 left-0 pr-3 -mb-5";
      default:
        return "left-1/2 -translate-x-1/2 px-3";
    }
  };

  return (
    <div className={classNames(styles.tooltipContainer, "group")}>
      <div className={classNames(styles.wrapper, getWrapperClassByPosition(), "group-hover:scale-100")}>
        <div className={classNames(styles.body, wrapperClass, "drop-shadow-[0_4px_4px_#A6A0A040]")}>
          <div className={styles.messageWrapper}>{message}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
