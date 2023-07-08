import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faTiktok,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

type NavigationItems = {
  name: string;
  link: string;
};

export const Footer = () => {
  const { t } = useTranslation();

  const navigationItems: NavigationItems[] = [
    { name: t("components.footer.aboutUs"), link: "" },
    { name: t("components.footer.contactUs"), link: "" },
    { name: t("components.footer.faq"), link: "" },
    { name: t("components.footer.sitemap"), link: "" },
    { name: t("components.footer.terms"), link: "" },
    { name: t("components.footer.privacy"), link: "" },
  ];

  const renderNavigation = () => {
    return (
      <div className="flex flex-col text-center lg:flex-row">
        {navigationItems.map((item) => {
          return (
            <span key={item.name} className="cursor-pointer p-2">
              {item.name}
            </span>
          );
        })}
      </div>
    );
  };

  const renderSocialMedia = () => {
    const socialMedia: IconDefinition[] = [faInstagram, faTwitter, faTiktok];

    return (
      <div className="flex w-full justify-around py-11 sm:justify-center">
        {socialMedia.map((item, index) => {
          return (
            <FontAwesomeIcon
              key={index}
              icon={item}
              className="fa-2xl cursor-pointer sm:px-10"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="border-slate-5 border-t-[1px]">
      <div className="flex flex-col items-center py-5">
        {renderSocialMedia()}
        {renderNavigation()}
      </div>
      <div className="flex flex-col items-center border-t-[1px] p-5">
        <span className="pointer-events-none text-center">
          © Influencer Market inc. 2023
        </span>
      </div>
    </div>
  );
};
