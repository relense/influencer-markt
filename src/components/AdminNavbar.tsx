import Link from "next/link";
import { useTranslation } from "react-i18next";

const AdminNavbar = () => {
  const { t } = useTranslation();

  const leftNavBar = () => {
    return (
      <div className="hidden flex-1 items-center justify-start lg:flex">
        <Link
          href="/admin/influencers"
          className="cursor-pointer text-lg lg:px-2"
        >
          {t("components.adminNavbar.influencers")}
        </Link>
        <Link href="/admin/brands" className="cursor-pointer px-2 text-lg">
          {t("components.adminNavbar.brands")}
        </Link>
        <Link href="/admin/messages" className="cursor-pointer px-2 text-lg">
          {t("components.adminNavbar.messages")}
        </Link>
      </div>
    );
  };

  const renderLogoTitle = () => {
    return (
      <Link href="/admin">
        <h1 className="m-0 hidden cursor-pointer text-left font-lobster text-2xl text-influencer xxs:flex lg:text-4xl">
          Influencer Markt
        </h1>
        <h1 className="m-0 flex cursor-pointer text-left font-lobster text-2xl text-influencer xxs:hidden lg:text-4xl">
          IM
        </h1>
      </Link>
    );
  };
  return (
    <nav>
      <div className="flex w-full select-none items-center justify-between px-4 py-2 lg:h-16 lg:gap-4 lg:p-12">
        {renderLogoTitle()}
        {leftNavBar()}
      </div>
    </nav>
  );
};

export { AdminNavbar };
