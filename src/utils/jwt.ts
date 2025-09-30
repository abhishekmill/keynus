import { jwtDecode } from "jwt-decode";

export const decrypt = async (token: string) => {
  try {
    const payload = jwtDecode(token);
    return payload;
  } catch (error) {
    return null;
  }
};
