"use server";

import { privateFetch } from "../../services/privateFetch";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

export const getAllCountries = async () => {
  const url = new URL(`${baseUrl}/Countries`);

  try {
    const response = await privateFetch(url, {
      method: "GET",
      cache: "no-cache",
    });
    return response;
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error?.message ?? "Something went wrong",
    };
  }
};
