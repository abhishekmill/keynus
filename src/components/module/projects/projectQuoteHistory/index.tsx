import React from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Link } from "../../../../navigation";
import classNames from "classnames";

import styles from "./style.module.scss";

type Props = {
  historyData: {
    createdOn: string;
    proposalDocumentURL: string;
    generatedBy: string;
  }[];
};

const ProjectQuoteHistoryTable: React.FC<Props> = ({ historyData }) => {
  const t = useTranslations();

  return (
    <div className={styles.wrapper}>
      <div className={styles.tHeader}>
        <div className={classNames(styles.th, styles.span3)}>{t("Date")}</div>
        <div className={classNames(styles.th, styles.span3)}>{t("Time")}</div>
        <div className={classNames(styles.th, styles.span3)}>{t("Amount of articles")}</div>
        <div className={classNames(styles.th, styles.span2)}>{t("Price")}</div>
      </div>
      {historyData?.map((item, index: number) => (
        <Link href={`${item?.proposalDocumentURL}`} key={index}>
          <div key={index} className={styles.tr}>
            <div className={classNames(styles.td, styles.span3)}>{format(item?.createdOn, "dd/MM/yyyy")}</div>
            <div className={classNames(styles.td, styles.span3)}>{format(item?.createdOn, "HH:mm")}</div>
            <div className={classNames(styles.td, styles.span3)}>{item?.generatedBy}</div>
          </div>
        </Link>
      ))}
      {/* {projectsRes?.isSuccess && !!projectsRes?.result?.totalCount && (
        <div className={styles.pagination}>
          <Pagination transText={{ itemsPerPage: t("items per page") }} length={projectsRes?.result?.totalCount ?? 0} />
        </div>
      )} */}
    </div>
  );
};

export default ProjectQuoteHistoryTable;
