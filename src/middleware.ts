import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, localePrefix, defaultLocale } from "./config";
import { decrypt } from "./utils/auth/jwt";

const privateRoute = /^\/(en|nl)\/projects\/*/;
const publicRoute = /^\/(en|nl)\/auth\/*/;

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createIntlMiddleware({
    defaultLocale,
    locales,
    localePrefix,
  });

  const accessToken = request.cookies.get("accessToken")?.value;

  const payload = await decrypt(accessToken ?? "{}");

  if (!payload || (payload.exp ?? 0) < Date.now() / 1000) {
    if (privateRoute?.test(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  } else {
    if (publicRoute?.test(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  }

  const response = handleI18nRouting(request);
  response.headers.set("x-locale", defaultLocale);

  return response;
}

export const config = {
  matcher: ["/", "/(nl|en)/:path*", "/((?!_next|_vercel|api|.*\\..*).*)"],
};
