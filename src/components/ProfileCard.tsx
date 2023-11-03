import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import {
  type IconDefinition,
  faBookmark as faBookmarkSolid,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

import { helper } from "../utils/helper";
import type { UserSocialMedia } from "../utils/globalTypes";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faPinterest,
  faTiktok,
  faTwitch,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useSession } from "next-auth/react";

const ProfileCard = (params: {
  id: string;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: string;
  country: string;
  username: string;
  type: "Brand" | "Influencer";
  bookmarked: boolean;
  highlightSocialMediaId?: number;
  onHandleBookmark?: () => void;
  openLoginModal?: () => void;
  loggedInProfileId: string;
  activeJobs?: number;
}) => {
  const { t } = useTranslation();
  const { status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    params.bookmarked ? params.bookmarked : false
  );
  const [usefullSocialMedia, setUsefullSocialMedia] = useState<UserSocialMedia>(
    {
      followers: -1,
      handler: "",
      id: -1,
      socialMediaName: "",
      socialMediaId: -1,
      url: "",
      valuePacks: [],
    }
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

  useEffect(() => {
    const socialMediaWithMostFollowers = () => {
      params.socialMedia.forEach((socialMedia) => {
        if (socialMedia.followers > usefullSocialMedia.followers) {
          setUsefullSocialMedia(socialMedia);
        }
      });
    };

    const selectSocialMediaById = () => {
      const foundSocialMedia = params.socialMedia.find(
        (socialMedia) =>
          socialMedia.socialMediaId === params.highlightSocialMediaId
      );

      if (!!foundSocialMedia) {
        setUsefullSocialMedia(foundSocialMedia);
      } else {
        socialMediaWithMostFollowers();
      }
    };

    if (params.highlightSocialMediaId) {
      selectSocialMediaById();
    } else {
      socialMediaWithMostFollowers();
    }
  }, [
    params.highlightSocialMediaId,
    params.socialMedia,
    usefullSocialMedia.followers,
    usefullSocialMedia.id,
  ]);

  const socialMediaIcon = (socialMediaName: string): IconDefinition => {
    if (socialMediaName === "Instagram") {
      return faInstagram;
    } else if (socialMediaName === "X") {
      return faXTwitter;
    } else if (socialMediaName === "TikTok") {
      return faTiktok;
    } else if (socialMediaName === "YouTube") {
      return faYoutube;
    } else if (socialMediaName === "Facebook") {
      return faFacebook;
    } else if (socialMediaName === "Linkedin") {
      return faLinkedin;
    } else if (socialMediaName === "Pinterest") {
      return faPinterest;
    } else if (socialMediaName === "Twitch") {
      return faTwitch;
    } else {
      return faGlobe;
    }
  };

  const handleClickBookmark = () => {
    if (status === "unauthenticated" && params.openLoginModal) {
      params.openLoginModal();
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

        <Link
          href={usefullSocialMedia.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-2 top-2 flex cursor-pointer gap-1 rounded-3xl border-[1px] border-transparent bg-black-transparent px-2 text-white"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={socialMediaIcon(usefullSocialMedia.socialMediaName)}
              className="fa-base text-white hover:text-white1 "
            />
            {helper.formatNumberWithKorM(usefullSocialMedia.followers)}
          </div>
        </Link>

        {params.bookmarked !== undefined && (
          <div
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => handleClickBookmark()}
          >
            {isBookmarked ? (
              <FontAwesomeIcon
                icon={faBookmarkSolid}
                className="fa-xl text-white hover:text-white1 "
              />
            ) : (
              <FontAwesomeIcon
                icon={faBookmark}
                className="fa-xl text-white hover:text-white"
              />
            )}
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-2">
            {params.socialMedia.map((socialMedia, index) => {
              if (index > 1) return;
              return (
                <Link
                  href={socialMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={socialMedia.id}
                  className="font-bold text-influencer"
                >
                  {socialMedia.socialMediaName}
                </Link>
              );
            })}
          </div>
          {params.type === "Influencer" &&
            usefullSocialMedia.valuePacks &&
            usefullSocialMedia.valuePacks[0] && (
              <div className="text-lg font-semibold">
                {helper.calculerMonetaryValue(
                  usefullSocialMedia.valuePacks[0]?.valuePackPrice
                )}
                €
              </div>
            )}
          {params.type === "Brand" &&
            params.activeJobs !== undefined &&
            params.activeJobs > 0 && (
              <div className="text-lg font-semibold">
                {t("components.profileCard.jobs", {
                  count: params.activeJobs,
                })}
              </div>
            )}
        </div>
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

export { ProfileCard };
