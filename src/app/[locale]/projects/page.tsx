import React from "react";

import ProjectsPage from "../../../components/pages/project";

const Page = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => (
  <ProjectsPage searchParams={searchParams} page="projects" />
);

export default Page;
