"use server";
import { api } from "../../utils/api";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

export async function getProjectLockerWallConfiguration(id: string) {
  const url = new URL(
    `${baseUrl}/KeyniusPIM/ConfigureLockerWall/GetProjectLockerwallConfiguration?KeyniusProjectLockerwallId=${id}`,
  );

  try {
    const response = await api.get(url, { isAuth: true });
    return { isSuccess: true, data: response };
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}

export async function saveLockerwallConfiguration(data: any) {
  const url = new URL(`${baseUrl}/KeyniusPIM/ConfigureLockerWall/SaveLockerwallConfiguration`);

  try {
    const response = await api.post(url, { isAuth: true, params: data });
    return response;
  } catch (error) {
    return { isSuccess: false, ...error };
  }
}
