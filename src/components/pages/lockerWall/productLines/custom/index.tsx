import React from "react";
import { useTranslations } from "next-intl";

import AppHeader from "../../../../module/_basic/appHeader";
import CustomLockerView from "../../../../module/lockerWall/customProduct/customLockerView";
import { IKeyniusPIMArticle } from "../../../../../utils/types";

type Props = {
  customData: IKeyniusPIMArticle;
  projectId: string;
};

const CustomLockerCreatorPage: React.FC<Props> = ({ customData, projectId }) => {
  const t = useTranslations();

  return (
    <div className="w-screen h-[calc(100vh-54px)] flex flex-col">
      <AppHeader
        heading={t("New lockerwall")}
        breadcrumb={[
          { label: t("Projects"), href: "/projects" },
          { label: "Project Details", href: `/projects/${projectId}` },
          { label: t("New lockerwall"), href: "#" },
        ]}
        hasPrev
      />
      <CustomLockerView
        customData={customData}
        transText={{
          description: t("Fill in your cabinet and door information"),
          doorDimensions: t("Door dimensions"),
          startConfigurator: t("Start configurator"),
          customCabinet: t("Custom cabinet"),
          cabinetDimensions: t("Cabinet dimensions"),
          height: t("Height"),
          width: t("Width"),
          depth: t("Depth"),
          doors: t("Doors"),
        }}
      />
    </div>
  );
};

export default CustomLockerCreatorPage;
