import React from "react";
import { getTranslations } from "next-intl/server";

import AppHeader from "../../../../module/_basic/appHeader";
import PageContentLayout from "../../../../layout/pageContentLayout";
import ProjectQuoteHistoryTable from "../../../../module/projects/projectQuoteHistory";

type Props = {
  projectId?: string;
  projectName?: string;
  historyData: any;
};

const ProjectQuoteHistoryPage: React.FC<Props> = async ({ projectId = "", projectName = "", historyData }) => {
  const t = await getTranslations();

  return (
    <>
      <AppHeader
        heading={t("Project details")}
        breadcrumb={[
          { label: t("Projects"), href: "/projects" },
          { label: projectName, href: `/projects/${projectId}` },
          { label: t("Quote history"), href: "#" },
        ]}
        navigation={[]}
        hasPrev
      />
      <PageContentLayout>
        <ProjectQuoteHistoryTable historyData={historyData?.result} />
      </PageContentLayout>
    </>
  );
};

export default ProjectQuoteHistoryPage;
