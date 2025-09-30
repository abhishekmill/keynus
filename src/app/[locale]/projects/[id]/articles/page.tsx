import React from "react";
import ArticleShopPage from "../../../../../components/pages/article";
import { getLockerwallProductLineFilterOptions } from "../../../../actions/lockerwall";
import { getArticleListByFilter } from "../../../../actions/article";
import callServerAction from "../../../../../utils/callServerAction";
import { getProjectDetailsById } from "../../../../actions/projects";

type ParamProps = {
  locale: string;
  id: string;
};

const Page = async ({ params, searchParams }: { params: ParamProps; searchParams: any }) => {
  const branch = searchParams?.branch?.split(",") ?? [];
  const useCase = searchParams?.useCase?.split(",") ?? [];
  const material = searchParams?.material?.split(",") ?? [];
  // const compartments = searchParams?.amountOfCompartments?.split("_") ?? [];
  // const column = searchParams?.columns?.split("_") ?? [];

  // Fix: Properly handle string to number conversion
  const pageNumber = (Number(searchParams?.page) || 1) - 1;
  const pageSize = Number(searchParams?.limit) || 10;
  const searchValue = searchParams?.search ?? "";

  try {
    const [projectData, res, filterRes] = await Promise.all([
      callServerAction(getProjectDetailsById, params.id),
      getArticleListByFilter({
        searchParams: {
          branch,
          useCase,
          material,
          pageNumber,
          pageSize,
          searchValue,
        },
      }),
      callServerAction(getLockerwallProductLineFilterOptions),
    ]);

    return (
      <ArticleShopPage
        res={res?.result ?? []}
        filterRes={filterRes?.data?.result ?? { branch: [], material: [], usecase: [] }}
        projectData={projectData?.result}
      />
    );
  } catch (error) {
    console.error("Error fetching articles data:", error);
    return { isSuccess: false, message: "Can't fetch articles data" };
  }
};

export default Page;
