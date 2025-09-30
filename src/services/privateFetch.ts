"use server";

import { cookies } from "next/headers";
import { redirect } from "../navigation";

export const privateFetch = async (url: URL | string, options?: RequestInit, isFileRes?: boolean) => {
  const accessToken = cookies().get("accessToken")?.value;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      redirect("/auth/login");
    }

    if (!isFileRes) {
      const res = await response.json();
      return res;
    } else {
      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "";
      if (contentDisposition) {
        // Fallback to `filename`
        const filenameRegular = contentDisposition.split(";").find((x) => x.trim().startsWith("filename"));
        if (filenameRegular) {
          fileName = filenameRegular.split("=")[1]?.trim().replace(/"/g, "").replace(".pdf", "");
        }
      }
      const res = { blob: blob, fileName: fileName };
      return res;
    }
  } catch (error: any) {
    console.error("error: ", error);
    return {
      isSuccess: false,
      message: error?.message ?? "Something went wrong",
    };
  }
};
