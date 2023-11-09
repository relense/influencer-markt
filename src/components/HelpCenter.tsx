import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faAddressCard,
  faEnvelope,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const HelpCenter = (params: { close: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute right-0 top-0 z-50 flex h-full w-full flex-col gap-2 bg-white p-4 lg:hidden">
      <div
        className="flex cursor-pointer items-center gap-4"
        onClick={() => params.close()}
      >
        <FontAwesomeIcon icon={faArrowLeft} />

        <div className="font-semibold">{t("components.navbar.helpCenter")}</div>
      </div>
      <div className="px-8">
        <Link
          href="/about"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faAddressCard} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.aboutUs")}
          </div>
        </Link>
      </div>
      <div className="px-8">
        <Link
          href="/contact-us"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faEnvelope} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.contactUs")}
          </div>
        </Link>
      </div>{" "}
      <div className="px-8">
        <Link
          href="/faq"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faCircleQuestion} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.faq")}
          </div>
        </Link>
      </div>
      <div className="cursor-pointer border-[1px] border-white1" />
      <div className="px-8">
        <Link
          href="/terms-conditions"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faFileLines} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.terms")}
          </div>
        </Link>
      </div>
      <div className="px-8">
        <Link
          href="/privacy-policy"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faFileLines} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.privacy")}
          </div>
        </Link>
      </div>
    </div>
  );
};

export { HelpCenter };
