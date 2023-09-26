import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark,
  faBriefcase,
  faHome,
  faSearch,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

type linkItem = {
  pageUrl: string;
  icon: IconDefinition;
  loggedIn: boolean;
  profileSetup: boolean;
};

const BottomBar = (params: {
  username: string;
  status: "authenticated" | "loading" | "unauthenticated";
  loggedInProfileId: number;
}) => {
  const router = useRouter();

  const navigationLinks: linkItem[] = [
    {
      pageUrl: "/",
      icon: faHome,
      loggedIn: false,
      profileSetup: false,
    },
    {
      pageUrl: "/explore/influencers",
      icon: faSearch,
      loggedIn: false,
      profileSetup: false,
    },
    {
      pageUrl: "/saved/influencers",
      icon: faBookmark,
      loggedIn: true,
      profileSetup: true,
    },
    {
      pageUrl: "/jobs",
      icon: faBriefcase,
      loggedIn: false,
      profileSetup: false,
    },
    {
      pageUrl: `/${params.username}`,
      icon: faUserCircle,
      loggedIn: true,
      profileSetup: true,
    },
  ];

  return (
    <div className="fixed bottom-0 z-40 flex w-full justify-between border-t-[1px] border-gray3 bg-white sm:hidden">
      {navigationLinks.map((navigationItem) => {
        const iconClass =
          router.pathname === navigationItem.pageUrl ||
          (router.pathname === "/[username]" &&
            navigationItem.pageUrl === `/${params.username}`)
            ? "fa-xl"
            : "fa-xl text-gray1";

        if (
          !navigationItem.loggedIn ||
          (params.status === "authenticated" &&
            navigationItem.loggedIn &&
            navigationItem.profileSetup === true &&
            params.loggedInProfileId !== -1)
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
