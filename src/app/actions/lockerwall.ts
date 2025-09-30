"use server";
import { FieldValues } from "react-hook-form";
import { privateFetch } from "../../services/privateFetch";
import { api } from "../../utils/api";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

/**
 * Get lockerwall by lockerwall id
 * @param id - id of the lockerwall
 * @returns lockerwall item
 */
export async function getLockerwallById(id: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/LockerWall/${id}`);

  const response = await privateFetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  return response;
}

/**
 * Get lockerwall list of the project by project id
 * @param id - id of the project
 * @returns lockewall list of the project
 */
export async function getLockerwallByProjectId(id: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/LockerWall/Project/${id}`);

  const response = await privateFetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  return response;
}

/**
 * Get locks category list
 * @returns response message
 */
export async function getLockerWallLockCategory() {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/GetPIMLockCategory`);

  const response = await privateFetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  return response;
}

/**
 * Get lock type by category
 * @param categoryId The id of category
 * @returns Response message
 */
export async function getLockerWallLockType(categoryId: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/GetPIMProjectLockType/${categoryId}`);

  const response = await privateFetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  return response;
}

/**
 * Create new lockerwall
 * @param data - request body data
 * @param projectId - project id
 * @returns response message
 */
export async function createNewLockerwall(data: FieldValues) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/LockerWall`);

  const body = {
    keyniusProjectId: data.projectId,
    lockerWallName: data.name,
    floor: data.floor,
    LockTypeId: data.type,
    LockCategoryId: data.category,
    notes: data.notes,
  };

  const response = await privateFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-cache",
  });

  return response;
}

/**
 * Update lockerwall by id
 * @param id - id of the lockerwall
 * @param projectId - id of the project
 * @param data - request body
 * @returns response message
 */
export async function updateLockerwall(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/LockerWall`);

  const body = {
    id: data?.id,
    keyniusProjectId: data?.projectId,
    ...(!!data?.name ? { lockerWallName: data.name } : {}),
    ...(!!data?.floor ? { floor: data.floor } : {}),
    ...(!!data?.type ? { LockTypeId: data.type } : {}),
    ...(!!data?.category ? { LockCategoryId: data.category } : {}),
    ...(!!data?.notes ? { notes: data.notes } : {}),
  };

  const response = await api.put(url, { params: body, isAuth: true });
  return response;
}

/**
 * Delete lockerwall by id
 * @param id - id of lockerwall
 */
export async function deleteLockerwall(id: string) {
  try {
    const url = new URL(`${baseUrl}/KeyniusPIM/Projects/LockerWall/${id}`);
    const response = await api.delete(url, { isAuth: true });
    return response;
  } catch (error: any) {
    return { isSuccess: false, ...error };
  }
}

export async function getLockerwallProductLineFilterOptions() {
  try {
    const url = new URL(`${baseUrl}/KeyniusPIM/Attribute/GetPIMAttributeEnums`);
    const response = await api.get(url, { isAuth: true });
    return {
      isSuccess: true,
      data: response,
    };
  } catch (error: any) {
    return {
      isSuccess: false,
      ...error,
    };
  }
}

export async function SaveLockerwallArticleNote(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/${data.projectId}/SaveLockerwallArticleNote`);
  try {
    const response = await api.post(url, {
      params: data.params,
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function getNumberingArticlesList() {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/GetNumberingArticlesList`);

  try {
    const response = await api.get(url, {
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function saveNumberingArticleToLockerWall(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/SaveNumberingArticleToLockerWall`);

  try {
    const response = await api.post(url, {
      params: data,
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}
