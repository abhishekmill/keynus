"use client";
import React from "react";
import Image from "next/image";

import Dropdown from "../../../../ui/dropdown";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "../../../../../navigation";

import styles from "./style.module.scss";

export const languages = [
  {
    name: "English",
    code: "en",
    flag: "/assets/flags/en.png",
  },
  {
    name: "Dutch",
    code: "nl",
    flag: "/assets/flags/nl.png",
  },
];

type Props = {
  transText?: { [key: string]: string };
};

const PopupPanel: React.FC<Props> = ({ transText }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (code: string) => {
    router.replace(pathname, { locale: code });
    router.refresh();
  };

  return (
    <div className={styles.popUp}>
      <h5 className={styles.heading}>{transText?.language}</h5>
      {languages.map((item) => (
        <button
          className={styles.selectorItem}
          key={item.code}
          onClick={() => {
            handleChange(item.code);
          }}
        >
          <div className={styles.flagWrapper}>
            <Image
              src={item.flag}
              width={60}
              height={30}
              sizes="(100vw, 100vh)"
              alt="Flag Icon"
              className={styles.image}
            />
          </div>
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
};

const LanguageSelector: React.FC<Props> = ({ transText }) => {
  const { locale } = useParams();

  return (
    <Dropdown options={[]} panel={<PopupPanel transText={transText} />}>
      <div className={styles.actionButton}>
        <div className={styles.icon}>
          <Image
            src={`/assets/flags/${locale}.png`}
            width={18}
            height={11}
            alt="Flag Icon"
            className={styles.flag}
            priority
          />
        </div>
      </div>
    </Dropdown>
  );
};

export default LanguageSelector;
