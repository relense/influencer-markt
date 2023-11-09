// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pt"],
  },
  trailingSlash: true,
  localePath: path.resolve("./public/locales"),
  // react: { useSuspense: false }, //this line
};
