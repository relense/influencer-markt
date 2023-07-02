import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  type IconDefinition,
  faCircleUser,
} from "@fortawesome/free-regular-svg-icons";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

type linkItem = {
  pageUrl: string;
  icon: IconDefinition;
};

const navigationLinks: linkItem[] = [
  {
    pageUrl: "/",
    icon: faHome,
  },
  {
    pageUrl: "/explore",
    icon: faSearch,
  },
  {
    pageUrl: "/profile",
    icon: faCircleUser,
  },
];

const BottomBar = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 flex w-full justify-between border-t-[1px] border-gray3 bg-white sm:hidden">
      {navigationLinks.map((navigationItem) => {
        const iconClass =
          router.pathname === navigationItem.pageUrl
            ? "fa-lg"
            : "fa-lg text-gray1";

        return (
          <Link
            key={navigationItem.pageUrl}
            href={navigationItem.pageUrl}
            className="flex flex-1 cursor-pointer items-center justify-center  p-4 text-center"
          >
            <FontAwesomeIcon icon={navigationItem.icon} className={iconClass} />
          </Link>
        );
      })}
    </div>
  );
};

export { BottomBar };
