import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark,
  faBriefcase,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

type linkItem = {
  pageUrl: string;
  icon: IconDefinition;
  loggedIn: boolean;
};

const navigationLinks: linkItem[] = [
  {
    pageUrl: "/",
    icon: faHome,
    loggedIn: false,
  },
  {
    pageUrl: "/explore/influencers",
    icon: faSearch,
    loggedIn: false,
  },
  {
    pageUrl: "/saved/influencers",
    icon: faBookmark,
    loggedIn: true,
  },
  {
    pageUrl: "/offers",
    icon: faBriefcase,
    loggedIn: false,
  },
];

const BottomBar = (params: {
  status: "authenticated" | "loading" | "unauthenticated";
}) => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 z-40 flex w-full justify-between border-t-[1px] border-gray3 bg-white sm:hidden">
      {navigationLinks.map((navigationItem) => {
        const iconClass =
          router.pathname === navigationItem.pageUrl
            ? "fa-lg"
            : "fa-lg text-gray1";

        if (
          !navigationItem.loggedIn ||
          (params.status === "authenticated" && navigationItem.loggedIn)
        ) {
          return (
            <Link
              key={navigationItem.pageUrl}
              href={navigationItem.pageUrl}
              className="flex flex-1 cursor-pointer items-center justify-center  p-4 text-center"
            >
              <FontAwesomeIcon
                icon={navigationItem.icon}
                className={iconClass}
              />
            </Link>
          );
        }
      })}
    </div>
  );
};

export { BottomBar };
