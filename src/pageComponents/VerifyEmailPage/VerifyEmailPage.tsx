import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
const VerifyEmailPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-1 cursor-default flex-col items-center justify-center gap-6 self-center px-4 pb-10 text-center sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="text-5xl font-semibold">{t("pages.verify.title")}</div>
      <div className="text-xl">{t("pages.verify.subtitle")}</div>
      <FontAwesomeIcon
        icon={faEnvelope}
        className="fa-2xl h-20 w-20 text-influencer"
      />
    </div>
  );
};

export { VerifyEmailPage };
