import { privateFetch } from "../../services/privateFetch";

const baseUrl =
  process.env.NODE_ENV === "development" ? process.env.BACKEND_DEV_API_URL : process.env.BACKEND_PROD_API_URL;

export async function getAllPartners() {
  const url = new URL(`${baseUrl}/KeyniusPIM/Partners/GetPIMPartnerList`);

  const response = await privateFetch(url, {
    method: "GET",
    cache: "no-cache",
  });

  return response;
}
