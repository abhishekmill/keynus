import React, { Suspense } from "react";
import LockerWallSelectorPage from "@/components/pages/lockerWall/productLines";
import callServerAction from "@/utils/callServerAction";
import { getCabinets } from "@/app/actions/cabinet";
import { getLockerwallById, getLockerwallProductLineFilterOptions } from "@/app/actions/lockerwall";
import { getProjectById } from "@/app/actions/projects";
import ErrorScreen from "../../../../../../../components/module/error";

type Props = {
  params: { id: string; lockerwallId: string };
  searchParams: Record<string, string>;
};

// Helper function to parse range parameters
const parseRangeParams = (param: string | undefined) => {
  if (!param) return {};
  const values = param.split("_").filter(Boolean);
  if (values.length === 0) return {};

  const numValues = values.map(Number).filter((n) => !isNaN(n));
  if (numValues.length === 0) return {};

  const min = Math.min(...numValues);
  const max = Math.max(...numValues);

  return {
    greaterThanEqual: min.toString(),
    lessThanEqual: max.toString(),
  };
};

// Helper function to check if search should be optimized
const shouldOptimizeQuery = (searchParams: Record<string, string>) => {
  const hasFilters = Object.keys(searchParams).some(
    (key) => !["page", "limit", "search", "sortProperty", "isDescending"].includes(key),
  );
  const hasSearch = !!searchParams?.search?.trim();
  return !hasFilters && !hasSearch; // Only optimize for simple queries
};

const page = async ({ params, searchParams }: Props) => {
  // Parse parameters with validation
  const branch = searchParams?.branch?.split("_").filter(Boolean) ?? [];
  const useCase = searchParams?.useCase?.split("_").filter(Boolean) ?? [];
  const material = searchParams?.material?.split("_").filter(Boolean) ?? [];
  const lockerLineCategoryIds = searchParams?.lockerLineCategory?.split("_").filter(Boolean) ?? [];

  // Use helper for range parameters
  const heightRanges = parseRangeParams(searchParams?.height);
  const widthRanges = parseRangeParams(searchParams?.width);
  const depthRanges = parseRangeParams(searchParams?.depth);
  const compartmentsRanges = parseRangeParams(searchParams?.amountOfCompartments);
  const columnRanges = parseRangeParams(searchParams?.columns);

  const pageNumber = Math.max(0, (Number(searchParams?.page) || 1) - 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams?.limit) || 10)); // Limit max page size
  const searchValue = searchParams?.search?.trim() ?? "";
  const sortProperty = searchParams?.sortProperty ?? "compartments";
  const isDescending = searchParams?.isDescending === "true";

  try {
    // Step 1: Get basic data first (should be fast)
    const [project, lockerwall] = await Promise.all([
      callServerAction(getProjectById, params.id),
      callServerAction(getLockerwallById, params.lockerwallId),
    ]);

    // Quick validation
    if (!project?.isSuccess || !lockerwall?.isSuccess) {
      return <ErrorScreen message="Project or lockerwall not found" />;
    }

    // Step 2: Optimize based on query complexity
    const isSimpleQuery = shouldOptimizeQuery(searchParams);

    if (isSimpleQuery) {
      // For simple queries, prioritize speed
      const [productLineRes, filterRes] = await Promise.all([
        callServerAction(getCabinets, {
          lockerwallId: lockerwall.result.lockTypeId,
          searchParams: {
            pageNumber,
            pageSize: Math.min(pageSize, 20), // Smaller initial load
            sortProperty,
            isDescending,
          },
        }),
        callServerAction(getLockerwallProductLineFilterOptions),
      ]);

      if (!productLineRes.isSuccess) {
        return <ErrorScreen message="Can't fetch lockerwall data" />;
      }

      return (
        <Suspense fallback={<div>Loading lockers...</div>}>
          <LockerWallSelectorPage
            product={productLineRes}
            filterRes={filterRes}
            project={project.result}
            lockerwall={lockerwall.result}
          />
        </Suspense>
      );
    }

    // Step 3: For complex queries, get filter options first (they're usually cached)
    const filterRes = await callServerAction(getLockerwallProductLineFilterOptions);

    // Step 4: Build optimized query parameters
    const queryParams = {
      lockerwallId: lockerwall.result.lockTypeId,
      searchParams: {
        ...(branch.length > 0 && { branch }),
        ...(useCase.length > 0 && { useCase }),
        ...(material.length > 0 && { material }),
        ...(lockerLineCategoryIds.length > 0 && { lockerLineCategoryIds }),
        ...(Object.keys(heightRanges).length > 0 && { heightRanges }),
        ...(Object.keys(widthRanges).length > 0 && { widthRanges }),
        ...(Object.keys(depthRanges).length > 0 && { depthRanges }),
        ...(Object.keys(compartmentsRanges).length > 0 && { compartmentsRanges }),
        ...(Object.keys(columnRanges).length > 0 && { columnRanges }),
        pageNumber,
        pageSize,
        ...(searchValue && { searchValue }),
        sortProperty,
        isDescending,
      },
    };

    // Step 5: Execute the main query
    const productLineRes = await callServerAction(getCabinets, queryParams);

    if (!productLineRes.isSuccess) {
      return <ErrorScreen message="Can't fetch lockerwall data" />;
    }

    // Replace the Suspense fallback with a proper loading component:
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Loading lockers...</div>
          </div>
        }
      >
        <LockerWallSelectorPage
          product={productLineRes}
          filterRes={filterRes}
          project={project.result}
          lockerwall={lockerwall.result}
        />
      </Suspense>
    );
  } catch (error: any) {
    console.error("LockerWall page error:", error);
    return <ErrorScreen message={error?.errors?.[0] ?? error?.error ?? "An error occurred"} />;
  }
};

export default page;
