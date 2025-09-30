import React from "react";
import { getTranslations } from "next-intl/server";

import AppHeader from "../../../module/_basic/appHeader";
import LockerFilterPanel from "../../../module/lockerWall/productLines/filterPanel";
import LockerList from "../../../module/lockerWall/productLines/productLineList";
import PageContentLayout from "@/components/layout/pageContentLayout";
import { ILockerwall, ILockerWallSelectorList, IProject } from "@/utils/types";

type Props = {
  product: ILockerWallSelectorList;
  filterRes: any;
  project: IProject;
  lockerwall: ILockerwall;
};

const LockerWallSelectorPage: React.FC<Props> = async ({ project, lockerwall, product, filterRes }) => {
  const t = await getTranslations();

  try {
    return (
      <>
        <AppHeader
          heading={t("New lockerwall")}
          breadcrumb={[
            { label: t("Projects"), href: "/projects" },
            { label: project?.projectName, href: `/projects/${project.id}` },
            { label: lockerwall?.lockerWallName, href: "#" },
          ]}
          hasPrev
          isDeleteRedirectRedux
          hasSearch={true}
          transText={{
            searchHere: t("Search cabinets"),
          }}
        />
        <PageContentLayout className="tablet:flex items-start justify-between gap-10">
          <LockerFilterPanel
            transText={{
              filter: t("Filter"),
              location: t("Location"),
              branch: t("Branch"),
              useCase: t("Use case"),
              material: t("Material"),
              lockerLineCategory: t("Locker line"),
              productLine: t("Product Line"),
              amountOfCompartments: t("Doors per Column"),
              columns: t("Amount of Columns"),
              dimensions: t("Dimensions"),
              height: t("Height"),
              width: t("Width per Column"),
              depth: t("Depth"),
              noResult: t("No results, use a different search filter"),
            }}
            branch={filterRes.isSuccess ? filterRes.data.result.branch : []}
            material={filterRes.isSuccess ? filterRes.data.result.material : []}
            usecase={filterRes.isSuccess ? filterRes.data.result.usecase : []}
            lockerLine={filterRes.isSuccess ? filterRes.data.result.lockerLineCategory : []}
          />

          <LockerList
            transText={{
              custom: t("Product line Custom"),
              height: t("Height"),
              width: t("Width"),
              depth: t("Depth"),
              doors: t("Doors"),
              compartments: t("Doors"),
              noResult: t("No results, use a different search filter"),
            }}
            id={project.id}
            lockerwallId={lockerwall.id}
            data={product?.result?.articleCategories?.length > 0 ? product.result.articleCategories : []}
            totalLength={product?.result?.totalCount ?? 0}
          />
        </PageContentLayout>
      </>
    );
  } catch (error) {
    return <div className="text-center py-24">{t("Project data or lockerwall data not found")}</div>;
  }
};

export default LockerWallSelectorPage;
