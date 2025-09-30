import React from "react";
import CustomDisclosure from "@/components/ui/disclosure";
import Link from "next/link";

import Icon from "../../../ui/Icon";

import styles from "./style.module.scss";

type Props = {
  datasheetData: string[];
  certificateData: string[];
  transText: {
    [key: string]: string;
  };
};

const ArticleTechnicalDetailModule: React.FC<Props> = ({ datasheetData = [], certificateData = [], transText }) => {
  return (
    <CustomDisclosure title={transText?.technicalDetails} defaultOpen>
      <div className={styles.wrapper}>
        <div>
          <h2 className={styles.title}>{transText?.datasheet}</h2>
          <div className={styles.dataContent}>
            {datasheetData.map((item, index) => (
              <div key={index} className={styles.item}>
                <Link href={item} download target="_blank" className={styles.link}>
                  <p>{`Datasheet${index + 1}.pdf`}</p>
                  <Icon name="FileDownload" className={styles.icon} />
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className={styles.title}>{transText?.certificate}</h2>
          <div className={styles.dataContent}>
            {certificateData.map((item, index) => (
              <div key={index} className={styles.item}>
                <Link href={item} download target="_blank" className={styles.link}>
                  <p>{`Certificate${index + 1}.pdf`}</p>
                  <Icon name="FileDownload" className={styles.icon} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomDisclosure>
  );
};

export default ArticleTechnicalDetailModule;
