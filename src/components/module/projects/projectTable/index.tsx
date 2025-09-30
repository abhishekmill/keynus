import React from "react";
import { getTranslations } from "next-intl/server";

import Pagination from "../../_basic/pagination";
import ProjectTableBody from "./projectTableBody";
import ProjectTableFilter from "./projectTableFilter";
import { getAllPartners } from "../../../../app/actions/partner";
import { getProjects } from "../../../../app/actions/projects";
import { getCookies } from "../../../../utils/cookie";
import { IProject } from "../../../../utils/types";

import styles from "./style.module.scss";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
  page: "archivedProjects" | "projects";
};

const ProjectTable: React.FC<Props> = async ({ searchParams, page }) => {
  const t = await getTranslations();

  /**
   * Fetch all projects, partners
   */
  const [projectsRes, partnersRes] = await Promise.all([getProjects(searchParams), getAllPartners()]);
  const [accessToken] = await getCookies(["accessToken"]);

  return (
    <div className={styles.wrapper}>
      <ProjectTableFilter
        partners={partnersRes?.isSuccess ? partnersRes?.result : []}
        page={page}
        transText={{
          status: t("Status"),
          partner: t("Partner"),
          salesRepresentative: t("Sales representative"),
        }}
        accessToken={accessToken}
        salesFilter={
          Array.from(new Set(projectsRes?.result?.projects?.map((item: IProject) => item.salesPersonName))) ?? []
        }
      />
      <div className={styles.table}>
        <ProjectTableBody
          projects={
            projectsRes?.isSuccess && searchParams?.salesRep
              ? projectsRes?.result?.projects?.filter(
                  (item: IProject) => item.salesPersonName === searchParams.salesRep,
                )
              : projectsRes?.isSuccess
                ? projectsRes?.result?.projects
                : []
          }
          searchParams={searchParams}
        />
      </div>
      {projectsRes?.isSuccess && !!projectsRes?.result?.totalCount && (
        <div className={styles.pagination}>
          <Pagination transText={{ itemsPerPage: t("items per page") }} length={projectsRes?.result?.totalCount ?? 0} />
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
