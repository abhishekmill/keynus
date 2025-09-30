"use server";

import { cookies } from "next/headers";
import { cookieConfig } from "../../utils/constant";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

export async function login(data: { email: string; password: string }) {
  const url = new URL(`${baseUrl}/Account/login`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, deviceId: "Web", platform: "Web" }),
      cache: "no-cache",
    });

    const res = await response.json();
    return res;
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error?.message ?? "Something went wrong",
    };
  }
}

export async function resetPassword({ email }: { email: string }) {
  const url = new URL(`${baseUrl}/Account/resetpassword/${email}`);

  try {
    const response = await fetch(url, {
      cache: "no-cache",
    });

    const res = await response.json();

    return res;
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error?.message ?? "Something went wrong",
    };
  }
}

export async function logout() {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
}

export async function setCookies({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  cookies().set("accessToken", accessToken, cookieConfig);
  cookies().set("refreshToken", refreshToken, cookieConfig);
}
