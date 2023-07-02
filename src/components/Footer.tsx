import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faTiktok,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons";

type NavigationItems = {
  name: string;
  link: string;
};

export const Footer = () => {
  const navigationItems: NavigationItems[] = [
    { name: "About Us", link: "" },
    { name: "Contact Us", link: "" },
    { name: "Frequently asked Questions", link: "" },
    { name: "Sitemap", link: "" },
    { name: "Terms and Conditions", link: "" },
    { name: "Privacy Policy", link: "" },
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
