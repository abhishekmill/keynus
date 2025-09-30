import React from "react";
import UpdateProjectPage from "../../../../../components/pages/project/update";

const Page = ({ params }: { params: { id: string } }) => <UpdateProjectPage id={params.id} />;

export default Page;
