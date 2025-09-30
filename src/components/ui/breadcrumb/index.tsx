import React from "react";
import Link from "next/link";
import classNames from "classnames";

import Icon from "../Icon";

import styles from "./style.module.scss";

type Props = {
  className?: string;
  links: { label: string; href: string }[];
};

const BreadCrumb: React.FC<Props> = ({ className, links }) => {
  return (
    <div className={classNames(styles.wrapper, className)}>
      {links.map((link, idx) => (
        <div key={idx} className={classNames(styles.link, { [styles.active]: idx === links.length - 1 })}>
          <Link href={link.href}>{link.label}</Link>
          {idx !== links.length - 1 && <Icon name="ArrowRight" className={styles.arrow} />}
        </div>
      ))}
    </div>
  );
};

export default BreadCrumb;
