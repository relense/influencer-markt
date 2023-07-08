module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pt"],
    localeDetection: false,
    fallbackLng: ["en"],
  },
  backend: {
    loadPath:
      (process.env.NEXT_PUBLIC_BASE_URL || "") + "/locales/{{lng}}/{{ns}}.json",
    addPath:
      (process.env.NEXT_PUBLIC_BASE_URL || "") + "/locales/{{lng}}/{{ns}}.json",
  },
};
