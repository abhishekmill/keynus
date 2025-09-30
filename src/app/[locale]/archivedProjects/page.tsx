import React from "react";

import ProjectsPage from "../../../components/pages/project";

const Page = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => (
  <ProjectsPage searchParams={searchParams} page="archivedProjects" />
);

export default Page;
