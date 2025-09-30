"use server";

import { api } from "../../utils/api";

type SearchParams = {
  branch?: string[];
  useCase?: string[];
  material?: string[];
  lockerLineCategoryIds?: string[];
  heightRanges?: { greaterThanEqual?: string; lessThanEqual?: string };
  widthRanges?: { greaterThanEqual?: string; lessThanEqual?: string };
  depthRanges?: { greaterThanEqual?: string; lessThanEqual?: string };
  compartmentsRanges?: { greaterThanEqual?: string; lessThanEqual?: string };
  columnRanges?: { greaterThanEqual?: string; lessThanEqual?: string };
  pageNumber?: number;
  pageSize?: number;
  searchValue?: string;
  sortProperty?: string;
  isDescending?: boolean;
  [key: string]: any;
};

type Props = {
  lockerwallId: string;
  searchParams?: SearchParams;
};

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

// Cache for simple queries (no filters)
const simpleQueryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to check if query is simple (no filters)
const isSimpleQuery = (searchParams?: SearchParams): boolean => {
  if (!searchParams) return true;

  const filterKeys = [
    "branch",
    "useCase",
    "material",
    "lockerLineCategoryIds",
    "heightRanges",
    "widthRanges",
    "depthRanges",
    "compartmentsRanges",
    "columnRanges",
  ];

  return (
    !filterKeys.some((key) => {
      const value = searchParams[key];
      return Array.isArray(value) ? value.length > 0 : value && Object.keys(value).length > 0;
    }) && !searchParams.searchValue?.trim()
  );
};

// Helper to create cache key
const createCacheKey = (lockerwallId: string, searchParams?: SearchParams): string => {
  const sortKey = `${searchParams?.sortProperty || "compartments"}_${searchParams?.isDescending || false}`;
  const pageKey = `${searchParams?.pageNumber || 0}_${searchParams?.pageSize || 10}`;
  return `${lockerwallId}_${sortKey}_${pageKey}`;
};

// Helper to clean request body (remove empty values)
const cleanRequestBody = (body: any): any => {
  const cleaned: any = {};

  Object.keys(body).forEach((key) => {
    const value = body[key];

    if (value === null || value === undefined) {
      return; // Skip null/undefined
    }

    if (Array.isArray(value)) {
      if (value.length > 0) cleaned[key] = value;
    } else if (typeof value === "object") {
      const cleanedObj = cleanRequestBody(value);
      if (Object.keys(cleanedObj).length > 0) cleaned[key] = cleanedObj;
    } else if (value !== "" && value !== 0) {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

export async function getCabinets({ lockerwallId, searchParams }: Props) {
  const startTime = Date.now();

  try {
    // Check cache for simple queries
    if (isSimpleQuery(searchParams)) {
      const cacheKey = createCacheKey(lockerwallId, searchParams);
      const cached = simpleQueryCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`Cache hit for ${cacheKey} - saved ${Date.now() - startTime}ms`);
        return cached.data;
      }
    }

    const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/GetArticleListToConfigureLockerWall`);

    // Build optimized request body
    const baseRequestBody = {
      lockTypeId: lockerwallId,
      // Always include pagination
      pageNumber: searchParams?.pageNumber ?? 0,
      pageSize: Math.min(50, searchParams?.pageSize ?? 20), // Cap page size
      sortProperty: searchParams?.sortProperty ?? "compartments",
      isDescending: searchParams?.isDescending ?? false,
    };

    // Only add filters that have values
    const requestBody = cleanRequestBody({
      ...baseRequestBody,
      ...searchParams,
    });

    // Log the full request body
    console.log(`Full request body for ${lockerwallId}:`, JSON.stringify(requestBody, null, 2));

    console.log(`getCabinets request for ${lockerwallId}:`, {
      filterCount: Object.keys(searchParams || {}).length,
      hasSearch: !!searchParams?.searchValue,
      pageSize: requestBody.pageSize,
    });

    // Set timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

    const response = await api.post(url, {
      isAuth: true,
      params: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const duration = Date.now() - startTime;
    console.log(`getCabinets completed in ${duration}ms`);

    // Cache simple successful queries
    if (isSimpleQuery(searchParams) && response?.isSuccess) {
      const cacheKey = createCacheKey(lockerwallId, searchParams);
      simpleQueryCache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      });

      // Clean old cache entries
      if (simpleQueryCache.size > 50) {
        const entries = Array.from(simpleQueryCache.entries());
        const oldestKey = entries.sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
        simpleQueryCache.delete(oldestKey);
      }
    }

    // Log slow queries for monitoring
    if (duration > 5000) {
      console.warn(`Slow query detected (${duration}ms):`, {
        lockerwallId,
        searchParams: JSON.stringify(searchParams),
        requestBody: JSON.stringify(requestBody),
      });
    }

    return response;
  } catch (error: any) {
    const duration = Date.now() - startTime;

    if (error.name === "AbortError") {
      console.error(`getCabinets timeout after ${duration}ms for ${lockerwallId}`);
      return {
        isSuccess: false,
        error: "Request timeout - please try again with fewer filters",
      };
    }

    console.error(`getCabinets error after ${duration}ms:`, error);
    throw error;
  }
}
