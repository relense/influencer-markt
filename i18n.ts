import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import config from "./i18next.config.js";

void i18n
  .use(LanguageDetector)
  .use(Backend)
  .init({
    ...i18n.options,
    ...config.i18n,
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    backend: config.backend,
    detection: {
      order: [
        "navigator",
        "localStorage",
        "cookie",
        "querystring",
        "sessionStorage",
        "htmlTag",
        "path",
        "subdomain",
      ],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
