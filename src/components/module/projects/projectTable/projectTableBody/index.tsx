import React from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

import SortableHeaderItem from "../../../_basic/table/sortableTableHeader";
import { Link } from "../../../../../navigation";
import { IProject } from "../../../../../utils/types";

import styles from "./style.module.scss";

type Props = {
  projects: IProject[];
  searchParams?: { [key: string]: string | string[] | undefined };
};

const ProjectTableBody: React.FC<Props> = ({ projects, searchParams }) => {
  const t = useTranslations();

  return projects?.length > 0 ? (
    <div className={styles.wrapper}>
      <div className={styles.tHeader}>
        <div className={classNames(styles.th, styles.span2)}>
          <SortableHeaderItem name="ProjectName" label={t("Project name")} />
        </div>
        <div className={classNames(styles.th, styles.span2)}>
          <SortableHeaderItem name="ProjectNumber" label={t("Project number")} />
        </div>
        <div className={classNames(styles.th, styles.span1)}>
          <SortableHeaderItem name="Date" label={t("Date")} />
        </div>
        <div className={classNames(styles.th, styles.span1)}>{t("Status")}</div>
        <div className={classNames(styles.th, styles.span1)}>
          <SortableHeaderItem name="Partner" label={t("Partner")} />
        </div>
        <div className={classNames(styles.th, styles.span1)}>
          <SortableHeaderItem name="Customer" label={t("Customer")} />
        </div>
        <div className={classNames(styles.th, styles.span2)}>
          <SortableHeaderItem name="SalesRepresentative" label={t("Sales representative")} />
        </div>
      </div>
      {(projects ?? []).map((item, index) => (
        <Link href={`/projects/${item?.id}`} key={index}>
          <div key={index} className={styles.tr}>
            <div className={classNames(styles.td, styles.span2)}>{item?.projectName}</div>
            <div className={classNames(styles.td, styles.span2)}>{item?.projectNumber}</div>
            <div className={classNames(styles.td, styles.span1)}>
              {item?.expectedDeliveryDate ? format(item?.expectedDeliveryDate, "dd/MM/yyyy") : ""}
            </div>
            <div className={classNames(styles.td, styles.span1)}>{item?.projectStatus}</div>
            <div className={classNames(styles.td, styles.span1)}>{item?.partnerName}</div>
            <div className={classNames(styles.td, styles.span1)}>{item?.customerName}</div>
            <div className={classNames(styles.td, styles.span2)}>{item?.salesPersonName}</div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div className={styles.blankDataWrapper}>
      <div className={styles.message}>
        {!!searchParams?.status || !!searchParams?.partner || !!searchParams?.search
          ? t("No results, use a different search term of filter")
          : t("There aren’t any projects yet, start by creating a new one")}
      </div>
    </div>
  );
};

export default ProjectTableBody;
