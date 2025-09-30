import React from "react";
import AppHeader from "../../../module/_basic/appHeader";
import LockerFilterPanel from "../../../module/lockerWall/productLines/filterPanel";
import { getTranslations } from "next-intl/server";
import PageContentLayout from "../../../layout/pageContentLayout";
import ProductCard from "../../../module/_basic/productCard";
import Skeleton from "react-loading-skeleton";

// Pre-create skeleton array outside component to avoid recreation
const SKELETON_ITEMS = Array.from({ length: 6 }, (_, index) => index);

const LockerwallLoadingSkeleton = async () => {
  const t = await getTranslations();

  // Batch all translations at once for better performance
  const translations = {
    projectDetails: t("Project details"),
    projects: t("Projects"),
    searchHere: t("Search here"),
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
    width: t("Width"),
    depth: t("Depth"),
    noResult: t("No results, use a different search filter"),
  };

  return (
    <div>
      <AppHeader
        heading={translations.projectDetails}
        breadcrumb={[
          { label: translations.projects, href: "/projects" },
          { label: "test", href: "#" },
        ]}
        navigation={[]}
        hasPrev
        transText={{ searchHere: translations.searchHere }}
        type="loading"
      />
      <PageContentLayout className="tablet:flex items-start justify-between gap-10">
        <LockerFilterPanel
          transText={{
            filter: translations.filter,
            location: translations.location,
            branch: translations.branch,
            useCase: translations.useCase,
            material: translations.material,
            lockerLineCategory: translations.lockerLineCategory,
            productLine: translations.productLine,
            amountOfCompartments: translations.amountOfCompartments,
            columns: translations.columns,
            dimensions: translations.dimensions,
            height: translations.height,
            width: translations.width,
            depth: translations.depth,
            noResult: translations.noResult,
          }}
          branch={[]}
          material={[]}
          usecase={[]}
          lockerLine={[]}
          type="loading"
        />
        <div className="relative w-full h-full space-y-40">
          <div className="px-16 w-full h-full relative mt-30">
            <h2 className="text-30 w-150">
              <Skeleton />
            </h2>
            <div className="grid grid-cols-1 desktop:grid-cols-3 gap-32 mt-24">
              {SKELETON_ITEMS.map((index) => (
                <div key={index} className="w-full h-full">
                  <ProductCard
                    image="/placeholder.jpg"
                    label=""
                    alt={`Locker preview-${index}`}
                    aspectRatio="aspect-square"
                    type="loading"
                  >
                    <div>
                      <ul>
                        <li>
                          <Skeleton width={60} />
                        </li>
                        <li>
                          <Skeleton width={60} />
                        </li>
                        <li>
                          <Skeleton width={60} />
                        </li>
                        <li>
                          <Skeleton width={80} />
                        </li>
                      </ul>
                    </div>
                  </ProductCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContentLayout>
    </div>
  );
};

export default LockerwallLoadingSkeleton;
