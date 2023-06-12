import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTwitter,
  faTiktok,
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
      <div>
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
    return (
      <div className="m-12">
        <FontAwesomeIcon
          icon={faInstagram}
          className="fa-2xl cursor-pointer px-10"
        />
        <FontAwesomeIcon
          icon={faTwitter}
          className="fa-2xl cursor-pointer px-10"
        />
        <FontAwesomeIcon
          icon={faTiktok}
          className="fa-2xl cursor-pointer px-10"
        />
      </div>
    );
  };

  return (
    <div className="border-slate-5 flexflex-col w-full border-t-[1px]">
      <div className="flex flex-1 flex-col items-center justify-center py-5">
        {renderSocialMedia()}
        {renderNavigation()}
      </div>
      <div className="flex justify-center border-t-[1px] p-5">
        <span className="pointer-events-none">
          © Influencer Market inc. 2023
        </span>
      </div>
    </div>
  );
};
