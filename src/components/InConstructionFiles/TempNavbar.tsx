import Link from "next/link";

export const TempNavbar = () => {
  const renderLogoTitle = () => {
    return (
      <Link href="/">
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
    <nav className="flex w-full select-none items-center justify-between px-4 py-2 lg:h-16 lg:gap-4 lg:p-12">
      {renderLogoTitle()}
    </nav>
  );
};
