import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getPathLocale,
  isLocalizablePath,
  localizePath,
  resolvePreferredLocale,
  siteLocaleCookieName,
} from "./lib/locales";

const publicFilePattern = /\.[^/]+$/;

function shouldBypass(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    publicFilePattern.test(pathname)
  );
}

function withLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(siteLocaleCookieName, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export function proxy(request: NextRequest) {
  const { method, nextUrl } = request;
  const { pathname } = nextUrl;

  if (method !== "GET" && method !== "HEAD") {
    return NextResponse.next();
  }

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const currentLocale = getPathLocale(pathname);
  const preferredLocale = resolvePreferredLocale({
    acceptLanguage: request.headers.get("accept-language"),
    cookieLocale: request.cookies.get(siteLocaleCookieName)?.value,
  });

  if (
    currentLocale === "en" &&
    preferredLocale === "zh-CN" &&
    isLocalizablePath(pathname)
  ) {
    const redirectUrl = nextUrl.clone();
    redirectUrl.pathname = localizePath("zh-CN", pathname);

    return withLocaleCookie(NextResponse.redirect(redirectUrl), "zh-CN");
  }

  const response = NextResponse.next();

  if (isLocalizablePath(pathname)) {
    withLocaleCookie(response, currentLocale);
  }

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
