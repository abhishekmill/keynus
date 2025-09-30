"use server";

import { privateFetch } from "../../services/privateFetch";
import { api } from "../../utils/api";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

type Props = {
  searchParams: { [key: string]: string | string[] | Object | undefined };
};

export async function getArticleListByFilter({ searchParams }: Props) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/GetArticleListToShop`);
  const requestBody = {
    ...searchParams,
  };

  const response = await privateFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    cache: "no-cache",
  });

  return response;
}

export async function getArticleById(id: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/Articles/${id}`);

  try {
    const response = await api.get(url, {
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function getArticleDetail(id: string) {
  try {
    const url = new URL(`${baseUrl}/KeyniusPIM/Projects/ArticleDetail/${id}`);
    const response = await api.get(url, { isAuth: true });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

type TAddShopArticle = {
  keyniusProjectId: string;
  keyniusPIMArticleId: string;
  quantity: number;
  pricePerUnit: number;
  discount: number;
  keyniusPIMArticleColorId: string;
};

export async function addShopArticleToProject(body: TAddShopArticle) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/AddWebShopArticletoProject`);

  try {
    const response = await api.post(url, {
      params: body,
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function deleteShopArticleToProject(id: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/DeleteWebShopArticleFromProject/${id}`);

  try {
    const response = await api.delete(url, {
      isAuth: true,
    });
    return response;
  } catch (error) {
    console.error("error: ", error);
    return { isSuccess: false, ...error };
  }
}

export async function deleteNumberingArticleToProject(params: {
  keyniusProjectLockerwallId: string;
  keyniusPIMArticleId: string;
}) {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/DeleteAccessoryFromLockerWall`);

  try {
    const response = await api.post(url, {
      isAuth: true,
      params: params,
    });
    return response;
  } catch (error) {
    console.error("error: ", error);
    return { isSuccess: false, ...error };
  }
}

export async function getDefaultArticleForCategory(categoryId: string) {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/GetDefaultArticleforCategory/${categoryId}`);

  try {
    const response = await api.get(url, {
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function updateArticle({ id, quantity, discount }: { id: string; quantity: number; discount: number }) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/UpdateWebShopArticleOfProject`);

  try {
    const response = await api.put(url, {
      params: { id, quantity, discount },
      isAuth: true,
    });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function saveProjectLockerwallPricing(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/SaveProjectLockerwallPricing`);
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

export async function SaveProjectAddOnNote(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/Projects/${data.projectId}/SaveProjectAddOnNote`);
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
