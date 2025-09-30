import React from "react";
import { useTranslations } from "next-intl";

import AppHeader from "../../module/_basic/appHeader";
import ProjectTable from "../../module/projects/projectTable";
import PageContentLayout from "../../layout/pageContentLayout";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
  page: "archivedProjects" | "projects";
};

const ProjectsPage: React.FC<Props> = ({ searchParams, page }) => {
  const t = useTranslations();
  return (
    <>
      <AppHeader
        heading={page === "projects" ? t("Projects") : t("Archived projects")}
        navigation={page === "projects" ? [{ label: t("New project"), type: "button", href: "/projects/new" }] : []}
        breadcrumb={page === "archivedProjects" ? [{ label: t("Projects"), href: `/projects` }] : []}
        hasPrev={page === "projects" ? false : true}
        hasSearch
        transText={{
          searchHere: t("Search here"),
        }}
      />
      <PageContentLayout>
        <ProjectTable searchParams={searchParams} page={page} />
      </PageContentLayout>
    </>
  );
};

export default ProjectsPage;
