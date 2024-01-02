import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faTiktok,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "next-i18next";
import Link from "next/link";

type NavigationItems = {
  name: string;
  link: string;
};

export const Footer = () => {
  const { t } = useTranslation();

  const navigationItems: NavigationItems[] = [
    { name: t("components.footer.aboutUs"), link: "/about" },
    { name: t("components.footer.contactUs"), link: "/contact-us" },
    { name: t("components.footer.faq"), link: "/faq" },
    { name: t("components.footer.terms"), link: "/terms-conditions" },
    { name: t("components.footer.privacy"), link: "/privacy-policy" },
  ];

  const renderNavigation = () => {
    return (
      <div className="hidden flex-col text-center lg:flex lg:flex-row">
        {navigationItems.map((item) => {
          return (
            <Link
              href={item.link}
              key={item.name}
              className="cursor-pointer p-2"
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    );
  };

  const renderSocialMedia = () => {
    return (
      <div className="flex w-full justify-center gap-24 py-4 lg:gap-0 lg:py-11">
        <a
          href="https://www.instagram.com/theinfluencermarkt/"
          className="cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            key="instagramIcon"
            icon={faInstagram}
            className="fa-2xl cursor-pointer sm:px-10"
          />
        </a>
        <a
          href="https://www.tiktok.com/@theinfluencermarkt"
          className="cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            key="tiktokIcon"
            icon={faTiktok}
            className="fa-2xl cursor-pointer sm:px-10"
          />
        </a>
      </div>
    );
  };

  return (
    <div className="border-slate-5 border-t-[1px] sm:block">
      <div className="flex flex-col items-center py-5">
        {renderSocialMedia()}
        {renderNavigation()}
      </div>
      <div className="flex flex-col items-center border-t-[1px] p-5">
        <span className="pointer-events-none text-center">
          © Influencer Markt, Lda
        </span>
      </div>
    </div>
  );
};
