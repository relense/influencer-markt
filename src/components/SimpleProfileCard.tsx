import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  type IconDefinition,
  faBookmark as faBookmarkSolid,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

import { helper } from "../utils/helper";
import type { UserSocialMedia } from "../utils/globalTypes";
import { useTranslation } from "next-i18next";
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

const SimpleProfileCard = (params: {
  id: string;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
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
  const [usefullSocialMedia, setUsefullSocialMedia] = useState<UserSocialMedia>(
    {
      userSocialMediaFollowers: {
        id: -1,
        name: "",
      },
      handler: "",
      id: -1,
      socialMediaName: "",
      socialMediaId: -1,
      url: "",
      valuePacks: [],
      mainSocialMedia: false,
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
      const mainSocialMedia = params.socialMedia.find(
        (socialMedia) => socialMedia.mainSocialMedia
      );

      if (
        mainSocialMedia &&
        mainSocialMedia.valuePacks &&
        mainSocialMedia.valuePacks.length > 0
      ) {
        setUsefullSocialMedia(mainSocialMedia);
      } else {
        const newMainSocialMedia = params.socialMedia.find(
          (socialMedia) =>
            socialMedia.valuePacks && socialMedia.valuePacks.length > 0
        );

        setUsefullSocialMedia(
          newMainSocialMedia || {
            userSocialMediaFollowers: {
              id: -1,
              name: "",
            },
            handler: "",
            id: -1,
            socialMediaName: "",
            socialMediaId: -1,
            url: "",
            valuePacks: [],
            mainSocialMedia: false,
          }
        );
      }
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
      console.log("");
    } else if (status === "authenticated" && params.loggedInProfileId === "") {
      toast.error(t("components.profileCard.toastWarning"), {
        position: "bottom-left",
      });
    } else if (status === "authenticated" && params.loggedInProfileId !== "") {
      onClickBookmark(params.id);
    }
  };

  const renderSocialMediaCornerButton = () => {
    if (usefullSocialMedia.userSocialMediaFollowers.id !== -1) {
      if (status === "authenticated" && params.loggedInProfileId !== "") {
        return (
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
              {usefullSocialMedia.userSocialMediaFollowers.name}
            </div>
          </Link>
        );
      } else if (
        status === "authenticated" &&
        params.loggedInProfileId === ""
      ) {
        return (
          <div
            className="absolute left-2 top-2 flex cursor-pointer gap-1 rounded-3xl border-[1px] border-transparent bg-black-transparent px-2 text-white"
            onClick={() =>
              toast.error(t("components.profileCard.socialMediaWarning"), {
                position: "bottom-left",
              })
            }
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={socialMediaIcon(usefullSocialMedia.socialMediaName)}
                className="fa-base text-white hover:text-white1 "
              />
              {usefullSocialMedia.userSocialMediaFollowers.name}
            </div>
          </div>
        );
      } else if (status === "unauthenticated" && params.openLoginModal) {
        return (
          <div
            className="absolute left-2 top-2 flex cursor-pointer gap-1 rounded-3xl border-[1px] border-transparent bg-black-transparent px-2 text-white"
            onClick={() => console.log("")}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={socialMediaIcon(usefullSocialMedia.socialMediaName)}
                className="fa-base text-white hover:text-white1 "
              />
              {usefullSocialMedia.userSocialMediaFollowers.name}
            </div>
          </div>
        );
      }
    }
  };

  const showMoneyRange = () => {
    if (
      usefullSocialMedia.valuePacks &&
      usefullSocialMedia.valuePacks[0] &&
      params.isLoggedInProfileBrand
    ) {
      let smallerValue = 0;
      let hightestValue = 0;

      usefullSocialMedia.valuePacks.forEach((valuePack, index) => {
        if (index === 0) {
          smallerValue = valuePack.valuePackPrice;
        } else if (index !== 0 && valuePack.valuePackPrice < smallerValue) {
          smallerValue = valuePack.valuePackPrice;
        }

        if (valuePack.valuePackPrice > hightestValue) {
          hightestValue = valuePack.valuePackPrice;
        }
      });

      return (
        <div className="text-md flex gap-1 font-semibold lg:text-lg">
          {usefullSocialMedia.valuePacks.length > 0 &&
            smallerValue !== hightestValue &&
            `${helper.calculerMonetaryValue(smallerValue)}`}
          {usefullSocialMedia.valuePacks.length > 0 &&
            smallerValue !== hightestValue && <span>-</span>}
          {helper.calculerMonetaryValue(hightestValue)}
        </div>
      );
    }
  };

  const renderSocialMedia = () => {
    if (usefullSocialMedia.userSocialMediaFollowers.id !== -1) {
      if (status === "authenticated" && params.loggedInProfileId !== "") {
        return (
          <Link
            href={usefullSocialMedia.url}
            target="_blank"
            rel="noopener noreferrer"
            key={usefullSocialMedia.id}
            className="text-md cursor-pointer font-bold text-influencer lg:text-lg"
          >
            {usefullSocialMedia.socialMediaName}
          </Link>
        );
      } else if (
        status === "authenticated" &&
        params.loggedInProfileId === ""
      ) {
        return (
          <div
            key={usefullSocialMedia.id}
            className="text-md cursor-pointer font-bold text-influencer lg:text-lg"
            onClick={() =>
              toast.error(t("components.profileCard.socialMediaWarning"), {
                position: "bottom-left",
              })
            }
          >
            {usefullSocialMedia.socialMediaName}
          </div>
        );
      } else if (status === "unauthenticated" && params.openLoginModal) {
        return (
          <div
            key={usefullSocialMedia.id}
            className="text-md cursor-pointer font-bold text-influencer lg:text-lg"
            onClick={() => console.log("")}
          >
            {usefullSocialMedia.socialMediaName}
          </div>
        );
      }
    }
  };

  return (
    <div className="flex w-80 flex-col gap-2">
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
        {renderSocialMediaCornerButton()}
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
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">{renderSocialMedia()}</div>
          {showMoneyRange()}
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
    </div>
  );
};

export { SimpleProfileCard };
