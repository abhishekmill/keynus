import React from "react";
import { getTranslations } from "next-intl/server";

import AppHeader from "../../module/_basic/appHeader";
import CreateLockerWallForm from "../../module/lockerWall/createLockerWallForm";
import PageContentLayout from "../../layout/pageContentLayout";
import { getLockerWallLockCategory } from "../../../app/actions/lockerwall";
import callServerAction from "../../../utils/callServerAction";
import { getProjectDetailsById } from "../../../app/actions/projects";

type Props = {
  id: string;
};

const LockerWallPage: React.FC<Props> = async ({ id }) => {
  const t = await getTranslations();

  //Get locker categories
  const [categoriesRes, projectData] = await Promise.all([
    callServerAction(getLockerWallLockCategory),
    callServerAction(getProjectDetailsById, id),
  ]);

  return (
    <>
      <AppHeader
        heading={t("New lockerwall")}
        breadcrumb={[
          { label: t("Projects"), href: "/projects" },
          { label: projectData?.result?.projectName ?? "", href: `/projects/${projectData?.result?.id}` },
          { label: t("New lockerwall"), href: "#" },
        ]}
        hasPrev
      />
      <PageContentLayout>
        <CreateLockerWallForm
          id={id}
          lockerCategories={categoriesRes.isSuccess ? categoriesRes.result : []}
          transText={{
            nameLabel: t("What's the name of this lockerwall"),
            lockerwallName: t("Lockerwall name"),
            floorLabel: t("Which location is this lockerwall on"),
            location: t("Location"),
            typeLabel: t("What is the lock type of this lockerwall"),
            lockerType: t("Locker type"),
            lockerCategory: t("Locker category"),
            notesLabel: t("Any notes on this lockerwall"),
            lockerwallNotes: t("Lockerwall notes"),
            save: t("Continue"),
          }}
        />
      </PageContentLayout>
    </>
  );
};

export default LockerWallPage;
