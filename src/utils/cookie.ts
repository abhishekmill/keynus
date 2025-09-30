"use server";
import { cookies } from "next/headers";
import { revalidatePath as nextRevalidatePath } from "next/cache";

export const setCookie = async (name: string, value: string) => {
  cookies().set(name, value);
};

export const getCookies = async (names: string[]) => names.map((item) => cookies().get(item)?.value ?? "");

export const revalidatePath = async (path: string) => nextRevalidatePath(path);

export const deleteCookie = async (name: string) => {
  cookies().delete(name);
};
