import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "next-i18next";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const BrandProfileCard = (params: {
  id: string;
  profilePicture: string;
  name: string;
  about: string;
  city: string;
  country: string;
  username: string;
  bookmarked: boolean;
  highlightSocialMediaId?: number;
  onHandleBookmark?: () => void;
  openLoginModal?: () => void;
  loggedInProfileId: string;
  isLoggedInProfileBrand: boolean;
  activeJobs?: number;
}) => {
  const { t } = useTranslation();
  const { status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    params.bookmarked ? params.bookmarked : false
  );

  const { mutate: updateFavorites } = api.profiles.updateFavorites.useMutation({
    onSuccess: (removed) => {
      toast.success(
        removed
          ? t("components.profileCard.removedProfile")
          : t("components.profileCard.savedProfile"),
        {
          position: "bottom-left",
        }
      );
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const onClickBookmark = (profileId: string) => {
    if (params.onHandleBookmark) {
      params.onHandleBookmark();
    }

    setIsBookmarked(!isBookmarked);
    updateFavorites({ profileId });
  };

  const handleClickBookmark = () => {
    if (status === "unauthenticated" && params.openLoginModal) {
      console.log("");
    } else if (status === "authenticated" && params.loggedInProfileId === "") {
      toast.error(t("components.profileCard.toastWarning"), {
        position: "bottom-left",
      });
    } else if (status === "authenticated" && params.loggedInProfileId !== "") {
      onClickBookmark(params.id);
    }
  };

  return (
    <div className="flex w-full  flex-col gap-2 lg:w-80">
      <div className="relative h-80 w-full self-center overflow-hidden rounded-xl shadow-xl lg:w-80">
        {params.profilePicture && (
          <Link href={`/${params.username}`}>
            <Image
              src={params.profilePicture}
              height={1000}
              width={1000}
              quality={100}
              alt={params.name}
              className="pointer-events-none flex h-80 w-full cursor-pointer rounded-xl object-cover transition-all duration-1000 hover:scale-125 lg:w-80"
              priority
            />
          </Link>
        )}

        {!params.profilePicture && (
          <div className="flex h-full flex-1 items-center justify-center self-center">
            <FontAwesomeIcon icon={faUser} className="flex text-8xl" />
          </div>
        )}

        {params.activeJobs !== undefined && params.activeJobs > 0 && (
          <div className="absolute left-2 top-2 flex cursor-pointer gap-1 rounded-3xl border-[1px] border-transparent bg-black-transparent px-2 text-white">
            {params.activeJobs !== undefined && params.activeJobs > 0 && (
              <div className="text-md font-semibold lg:text-lg">
                {t("components.profileCard.jobs", {
                  count: params.activeJobs,
                })}
              </div>
            )}
          </div>
        )}

        {params.bookmarked !== undefined && (
          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => handleClickBookmark()}
          >
            {isBookmarked ? (
              <FontAwesomeIcon
                icon={faBookmarkSolid}
                className="fa-xl rounded-md bg-black-transparent p-2 text-white hover:text-white1"
              />
            ) : (
              <FontAwesomeIcon
                icon={faBookmark}
                className="fa-xl rounded-md bg-black-transparent p-2 text-white hover:text-white1"
              />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <Link href={`/${params.username}`} className="text-xl font-bold">
          {params.name}
        </Link>
        <div className="text-sm text-gray2">
          {params.country}, {params.city}
        </div>
      </div>
      <div>
        <div className="line-clamp-4 text-gray2">{params.about}</div>
        <Link
          href={`/${params.username}`}
          className="font-bold text-influencer"
        >
          {t("components.profileCard.readMore")}
        </Link>
      </div>
    </div>
  );
};

export { BrandProfileCard };
