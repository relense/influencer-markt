import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";

const DeleteAccountInfoPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-1 cursor-default flex-col items-center gap-6 self-center px-4 pb-10 text-center sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="text-5xl font-semibold">
        {t("pages.deleteAccountInfoPage.title")}
      </div>
      <FontAwesomeIcon icon={faTrash} className="text-6xl text-gray4" />
      <div className="text-xl">
        {t("pages.deleteAccountInfoPage.subtitle1")}
      </div>
      <div className="text-xl">
        {t("pages.deleteAccountInfoPage.subtitle2")}
      </div>
      <div className="text-xl">
        {t("pages.deleteAccountInfoPage.subtitle3")}
      </div>
    </div>
  );
};

export { DeleteAccountInfoPage };
