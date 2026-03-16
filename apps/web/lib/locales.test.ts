import { describe, expect, it } from "vitest";

import {
  detectLocaleFromAcceptLanguage,
  getPathLocale,
  isLocalizablePath,
  localizePath,
  resolvePreferredLocale,
} from "./locales";

describe("locale helpers", () => {
  it("detects the locale from localized paths", () => {
    expect(getPathLocale("/")).toBe("en");
    expect(getPathLocale("/resources/example")).toBe("en");
    expect(getPathLocale("/zh-CN")).toBe("zh-CN");
    expect(getPathLocale("/zh-CN/resources/example")).toBe("zh-CN");
  });

  it("maps localizable paths into chinese routes", () => {
    expect(localizePath("zh-CN", "/")).toBe("/zh-CN");
    expect(localizePath("zh-CN", "/docs")).toBe("/zh-CN/docs");
    expect(localizePath("en", "/zh-CN/docs")).toBe("/docs");
  });

  it("knows which public routes can be localized", () => {
    expect(isLocalizablePath("/")).toBe(true);
    expect(isLocalizablePath("/resources/article")).toBe(true);
    expect(isLocalizablePath("/api/health")).toBe(false);
    expect(isLocalizablePath("/feed.xml")).toBe(false);
  });

  it("resolves preferred locale from cookie first, then accept-language", () => {
    expect(
      resolvePreferredLocale({
        acceptLanguage: "en-US,en;q=0.9,zh-CN;q=0.8",
        cookieLocale: "zh-CN",
      }),
    ).toBe("zh-CN");

    expect(
      resolvePreferredLocale({
        acceptLanguage: "zh-CN,zh;q=0.9,en;q=0.8",
      }),
    ).toBe("zh-CN");

    expect(detectLocaleFromAcceptLanguage("fr-FR,fr;q=0.9,en;q=0.8")).toBe(
      "en",
    );
  });
});
