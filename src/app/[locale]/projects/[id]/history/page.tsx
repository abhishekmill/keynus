import React from "react";
import ProjectQuoteHistoryPage from "../../../../../components/pages/project/detail/history";
import callServerAction from "../../../../../utils/callServerAction";
import { getProjectById, getProjectHistory } from "../../../../actions/projects";

const Page = async ({ params }: { params: { id: string } }) => {
  const [projectData, historyData] = await Promise.all([
    callServerAction(getProjectById, params.id),
    callServerAction(getProjectHistory, params.id),
  ]);

  return (
    <ProjectQuoteHistoryPage
      projectId={params.id}
      projectName={projectData?.result?.projectName}
      historyData={historyData}
    />
  );
};

export default Page;
