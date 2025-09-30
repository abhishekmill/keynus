import React from "react";
import LockerWallPage from "../../../../../components/pages/lockerWall";

const page = ({ params }: { params: { id: string } }) => <LockerWallPage id={params.id} />;

export default page;
