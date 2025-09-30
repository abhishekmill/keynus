import { getCookies } from "./cookie";
import { decrypt } from "./jwt";

type ApiRequestPath = RequestInfo | URL;

type ApiRequestInit = RequestInit & {
  params?: object;
  isAuth?: boolean;
  isFile?: boolean;
};

export const stringify = (params: object): string => {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item);
      }
    } else if (value !== null && value !== "") {
      query.append(key, value);
    }
  }

  return `${query}`;
};

class Api {
  baseUrl?: string;
  isRefreshing?: boolean;

  constructor() {
    this.baseUrl = process.env.BACKEND_DEV_API_URL;
    this.isRefreshing = false;
  }

  get(path: ApiRequestPath, opts: ApiRequestInit = {}) {
    return this.request(opts?.params ? `${path}?${stringify(opts.params)}` : path, { ...opts });
  }

  post(path: ApiRequestPath, opts: ApiRequestInit = {}) {
    return this.request(path, {
      ...opts,
      method: "POST",
      body: opts.params as BodyInit,
    });
  }

  put(path: ApiRequestPath, opts: ApiRequestInit = {}) {
    return this.request(path, {
      ...opts,
      method: "PUT",
      body: opts.params as BodyInit,
    });
  }

  delete(path: ApiRequestPath, opts: ApiRequestInit = {}) {
    return this.request(path, {
      ...opts,
      method: "DELETE",
      body: opts.params as BodyInit,
    });
  }

  async request(path: ApiRequestPath, opts: ApiRequestInit = {}) {
    let token;

    if (opts.isAuth) {
      while (this.isRefreshing);

      const [accessToken] = await getCookies(["accessToken"]);
      const payload = await decrypt(accessToken ?? "");

      if (!accessToken) {
        return Promise.reject({
          status: 401,
          data: {
            message: "You are not logged in",
          },
        });
      }

      token = accessToken;

      if (!payload || (payload.exp ?? 0) < Date.now() / 1000 - 5) {
        // const url = new URL(`${this.baseUrl}/Account/refresh`);
        // this.isRefreshing = true;
        // const response = await fetch(url, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ refreshToken }),
        //   cache: "no-cache",
        // });
        // this.isRefreshing = false;
        // if (response.ok) {
        //   const res = await response.json();
        //   setCookie("accessToken", res.accessToken);
        //   token = res.accessToken;
        // } else {
        //   const res = await response.json().catch(() => "Error");
        //   if (response.status === 401) {
        //     deleteCookie("accessToken");
        //     deleteCookie("refreshToken");
        //   }
        //   return Promise.reject({
        //     ...res,
        //     status: response.status,
        //   });
        // }
        return Promise.reject({
          status: 401,
          data: {
            message: "You are not logged in",
          },
        });
      }
    }

    const response = await fetch(path.toString().includes("http") ? path : `${this.baseUrl}/${path}`, {
      method: opts.method,
      headers: {
        ...opts.headers,
        ...(opts.isAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!opts.isFile ? { Accept: "application/json", "Content-Type": "application/json" } : {}),
      },
      ...(opts.body
        ? {
            body: opts.isFile ? opts.body : JSON.stringify(opts.body),
          }
        : {}),
      next: opts.next,
    });

    if (response.ok) {
      return response.json().catch(() => "No content");
    }

    const res = await response.json().catch(() => "Error");

    return Promise.reject({
      ...res,
      status: response.status,
    });
  }
}

export const api = new Api();
