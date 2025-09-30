import React from "react";
import classNames from "classnames";
import Image from "next/image";

import Icon from "../../../../../../../ui/Icon";
import { ICurrency } from "../../../../../../../../utils/types";

import styles from "./style.module.scss";

type Props = {
  title: string;
  previewImage?: string;
  location?: string;
  amountOfLockers?: number;
  priceOfLockers?: string;
  isOpen?: boolean;
  transText?: { [key: string]: string };
  currency?: ICurrency;
};

const LockerwallItemHeader: React.FC<Props> = ({
  title,
  previewImage,
  location,
  amountOfLockers,
  priceOfLockers,
  isOpen = false,
  currency,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.previewWrapper}>
        <Image
          src={`${previewImage ?? "/preview/sample_locker.webp"}`}
          alt={title}
          width={100}
          height={100}
          className={styles.image}
          sizes="(60px, 60px)"
          priority
        />
      </div>
      <div className={styles.nameWrapper}>{title}</div>
      <div className={styles.locationWrapper}>{location}</div>
      <div className={styles.amountWrapper}>{amountOfLockers}</div>
      <div className={styles.priceWrapper}>{priceOfLockers && `${currency?.symbol ?? "€"} ${priceOfLockers}`}</div>
      <a className={classNames(styles.chevronIcon, { [styles.open]: isOpen })}>
        <Icon name="ChevronDown" className={styles.icon} />
      </a>
    </div>
  );
};

export default LockerwallItemHeader;
