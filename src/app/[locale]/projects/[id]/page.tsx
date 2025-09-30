import React from "react";
import ProjectDetailPage from "../../../../components/pages/project/detail";

const Page = ({ params }: { params: { id: string } }) => <ProjectDetailPage id={params.id} />;

export default Page;
