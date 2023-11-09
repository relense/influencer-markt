import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLifeRing,
  type IconDefinition,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark,
  faBriefcase,
  faHome,
  faSearch,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HelpCenter } from "./HelpCenter";
import { useWindowWidth } from "../utils/helper";

type linkItem = {
  pageUrl: string;
  icon: IconDefinition;
  loggedIn: boolean;
  profileSetup: boolean;
};

const BottomBar = (params: {
  username: string;
  status: "authenticated" | "loading" | "unauthenticated";
  loggedInProfileId: string;
  userIsLoading: boolean;
}) => {
  const router = useRouter();
  const width = useWindowWidth();

  const [openHelpCenter, setOPenHelpCenter] = useState<boolean>(false);

  useEffect(() => {
    if (openHelpCenter) {
      setOPenHelpCenter(false);
    }
  }, [width]);

  useEffect(() => {
    if (openHelpCenter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openHelpCenter]);

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

  if (
    params.status === "loading" ||
    (params.userIsLoading && status === "authenticated")
  ) {
    return (
      <div className="fixed bottom-0 z-40 flex w-full justify-between border-t-[1px] border-gray3 bg-white pb-2 sm:hidden"></div>
    );
  } else {
    return (
      <>
        <div className="fixed bottom-0 z-40 flex w-full justify-between border-t-[1px] border-gray3 bg-white pb-2 sm:hidden">
          {navigationLinks.map((navigationItem) => {
            const iconClass =
              router.pathname === navigationItem.pageUrl ||
              (router.pathname === "/[username]" &&
                navigationItem.pageUrl === `/${params.username}`)
                ? "fa-lg"
                : "fa-lg text-gray1";

            if (
              !navigationItem.loggedIn ||
              (params.status === "authenticated" &&
                navigationItem.loggedIn &&
                navigationItem.profileSetup === true &&
                params.loggedInProfileId !== "")
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
          {params.status === "unauthenticated" && (
            <div
              className="flex flex-1 cursor-pointer items-center justify-center  p-4 text-center"
              onClick={() => setOPenHelpCenter(true)}
            >
              <FontAwesomeIcon icon={faLifeRing} className="fa-lg text-gray1" />
            </div>
          )}
        </div>
        {openHelpCenter && (
          <div className="absolute top-0 z-50 h-full w-full overflow-hidden bg-white">
            <HelpCenter close={() => setOPenHelpCenter(false)} />
          </div>
        )}
      </>
    );
  }
};

export { BottomBar };
