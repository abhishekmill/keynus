import React from "react";
import ConfiguratorPage from "../../../../../../../components/pages/configurator";
import { getProjectLockerWallConfiguration } from "../../../../../../actions/configurator";

type Props = {
  locale: string;
  id: string;
  lockerwallId: string;
};

const page = async ({ params }: { params: Props }) => {
  console.time("configurator API fetch");
  const response = await getProjectLockerWallConfiguration(params.lockerwallId);
  console.timeEnd("configurator API fetch");

  return <ConfiguratorPage lockerwallData={response?.data?.result ?? []} lockerWallId={params.lockerwallId} />;
};

export default page;
