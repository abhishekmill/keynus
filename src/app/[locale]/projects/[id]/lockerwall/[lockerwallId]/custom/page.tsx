import React from "react";

import CustomLockerCreatorPage from "../../../../../../../components/pages/lockerWall/productLines/custom";
import callServerAction from "../../../../../../../utils/callServerAction";
import { getArticleDetail } from "../../../../../../actions/article";

const page = async ({ params, searchParams }: { params: any; searchParams: { id: string } }) => {
  const res = await callServerAction(getArticleDetail, searchParams.id);
  return <CustomLockerCreatorPage customData={res.result} projectId={params.id} />;
};

export default page;
