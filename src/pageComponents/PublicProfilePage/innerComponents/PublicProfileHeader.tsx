import {
  type IconDefinition,
  faCamera,
  faGlobe,
  faPencil,
  faShareFromSquare,
  faBookmark as faBookmarkSolid,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import toast from "react-hot-toast";

import { helper } from "../../../utils/helper";
import type { ProfileData, Option } from "../../../utils/globalTypes";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { ProfileForm } from "../../../components/ProfileForm";

type ProfileHeader = {
  profileUserId: string;
  profileName: string;
  profileVerificationStatusId: number;
  profilePicture: string;
  profileWebsite: string;
  profileAbout: string;
  profileCountry: Option;
  profileCity: Option;
  isProfileBookmarked: boolean;
  userSocialMedia: {
    id: number;
    url: string;
    socialMediaName: string;
    socialMediaFollowers: number;
  }[];
};

const PublicProfileHeader = (params: {
  openShareModal: () => void;
  handleBookmark: () => void;
  username: string;
  profileHeader: ProfileHeader;
}) => {
  const session = useSession();
  const { t } = useTranslation();
  const ctx = api.useUtils();

  const [disableUpdateProfileButton, setDisableUpdateProfileButton] =
    useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const { mutate: updateProfile, isLoading: isLoadingUpdateProfile } =
    api.profiles.updateProfile.useMutation({
      onSuccess: () => {
        void ctx.profiles.getProfileByUniqueUsername.invalidate().then(() => {
          setIsProfileModalOpen(false);
          setDisableUpdateProfileButton(false);
          profileReset();
          toast.success(`Profile updated successfully`, {
            position: "bottom-left",
          });
        });
        void ctx.profiles.getProfileMinimumInfo.invalidate();
      },
      onError: () => {
        setIsProfileModalOpen(false);
        setDisableUpdateProfileButton(false);
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const {
    control: profileControl,
    register: profileRegister,
    setValue: profileSetValue,
    watch: profileWatch,
    handleSubmit: handleSubmitProfile,
    reset: profileReset,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileData>({
    defaultValues: {
      nationOfBirth: { id: -1, name: "" },
      placeThatLives: { id: -1, name: "" },
      profilePicture: "",
      website: "",
    },
  });

  useEffect(() => {
    profileSetValue("about", params.profileHeader.profileAbout || "");
    profileSetValue(
      "placeThatLives",
      params.profileHeader.profileCity || { id: -1, name: "" }
    );
    profileSetValue(
      "nationOfBirth",
      params.profileHeader.profileCountry || { id: -1, name: "" }
    );
    profileSetValue("displayName", params.profileHeader.profileName || "");
    profileSetValue("website", params.profileHeader.profileWebsite || "");
    profileSetValue(
      "profilePicture",
      params.profileHeader.profilePicture || ""
    );
  }, [
    params.profileHeader.profileAbout,
    params.profileHeader.profileCity,
    params.profileHeader.profileCountry,
    params.profileHeader.profileName,
    params.profileHeader.profilePicture,
    params.profileHeader.profileWebsite,
    profileSetValue,
    t,
  ]);

  const onUpdateProfile = handleSubmitProfile((data) => {
    if (isProfileDirty) {
      setDisableUpdateProfileButton(true);
      updateProfile({
        about: data.about,
        city: data.placeThatLives,
        country: data.nationOfBirth,
        name: data.displayName,
        website: data.website,
        profilePicture: data.profilePicture,
      });
    }
  });

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

  const renderCheckMark = () => {
    if (params.profileHeader.profileVerificationStatusId !== -1) {
      let tooltip = t("pages.publicProfilePage.verified");
      let iconClass =
        "flex h-7 w-7 items-center justify-center rounded-full bg-influencer-green-dark p-2 text-white";
      if (params.profileHeader.profileVerificationStatusId === 3) {
        tooltip = t("pages.publicProfilePage.needsVerification");
        iconClass =
          "flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 p-2 text-white";
      }

      if (
        params.profileHeader.profileVerificationStatusId === 3 ||
        params.profileHeader.profileVerificationStatusId === 2
      ) {
        return (
          <div className="group relative">
            <div className={iconClass}>
              <FontAwesomeIcon icon={faCheck} className="fa-sm" />
            </div>
            <div className="absolute top-8 z-10 hidden rounded-lg border-[1px] bg-gray4 p-4 text-white opacity-90 group-hover:flex group-hover:flex-1">
              <div className="w-full">{tooltip}</div>
            </div>
          </div>
        );
      }
    }
  };

  const updateProfileModal = () => {
    if (isProfileModalOpen) {
      return (
        <Modal
          onClose={() => setIsProfileModalOpen(false)}
          title={t("pages.publicProfilePage.profileModalTitle")}
          button={
            <div className="flex w-full justify-center p-4 sm:px-8">
              <Button
                type="submit"
                title={t("pages.publicProfilePage.profileModalButton")}
                isLoading={isLoadingUpdateProfile}
                disabled={isLoadingUpdateProfile || disableUpdateProfileButton}
                level="primary"
                form="form-hook"
              />
            </div>
          }
        >
          <div className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8">
            <ProfileForm
              control={profileControl}
              register={profileRegister}
              submit={onUpdateProfile}
              isProfileUpdate={true}
              errors={profileErrors}
              setValue={profileSetValue}
              watch={profileWatch}
            />
          </div>
        </Modal>
      );
    }
  };

  return (
    <>
      <div className="flex flex-1 cursor-default flex-col-reverse gap-4 lg:flex-row">
        <div className="flex-2 flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          {params.profileHeader.profilePicture ? (
            <Image
              src={params.profileHeader.profilePicture || ""}
              alt="profile picture"
              width={400}
              height={400}
              quality={100}
              className="pointer-events-none h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2 text-center lg:text-left">
            <div className="flex flex-col items-center justify-center gap-2 xs:flex-row xs:flex-wrap lg:justify-start">
              {params.profileHeader.userSocialMedia?.map(
                (socialMedia, index) => {
                  return (
                    <div
                      className="flex items-start gap-2 lg:items-center"
                      key={socialMedia.id}
                    >
                      <Link
                        href={socialMedia.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex cursor-pointer items-center gap-2 font-semibold text-influencer"
                      >
                        <FontAwesomeIcon
                          icon={socialMediaIcon(socialMedia.socialMediaName)}
                          className="fa-lg"
                        />

                        <div className="hidden lg:flex">
                          {socialMedia.socialMediaName}
                        </div>
                      </Link>
                      <div>
                        {helper.formatNumberWithKorM(
                          socialMedia.socialMediaFollowers
                        )}
                      </div>
                      {params.profileHeader.userSocialMedia.length - 1 !==
                        index && (
                        <div
                          key={`${socialMedia.id} + dot`}
                          className="hidden h-1 w-1 rounded-full bg-black lg:block"
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
            <div className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold lg:text-4xl">
                  {params.profileHeader.profileName}
                </div>
                {session.data?.user.id ===
                  params.profileHeader.profileUserId && (
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="fa-xl cursor-pointer text-influencer"
                    onClick={() => setIsProfileModalOpen(true)}
                  />
                )}
              </div>
              {params.profileHeader.profileWebsite && (
                <Link
                  href={params.profileHeader.profileWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer pt-1"
                >
                  <FontAwesomeIcon icon={faGlobe} className="fa-lg" />
                </Link>
              )}
              {renderCheckMark()}
            </div>
            <div className="text-lg text-gray2">
              {params.profileHeader.profileCountry?.name},{" "}
              {params.profileHeader.profileCity?.name}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-row-reverse items-start justify-end gap-4 lg:flex-row">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => params.openShareModal()}
          >
            <FontAwesomeIcon
              icon={faShareFromSquare}
              className="fa-lg hidden lg:flex"
            />
            <FontAwesomeIcon
              icon={faShareFromSquare}
              className="fa-md lg:hidden"
            />

            <div className="underline">
              {t("pages.publicProfilePage.share")}
            </div>
          </div>

          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => params.handleBookmark()}
          >
            {params.profileHeader.isProfileBookmarked ? (
              <>
                <FontAwesomeIcon
                  icon={faBookmarkSolid}
                  className="fa-lg hidden lg:flex"
                />
                <FontAwesomeIcon
                  icon={faBookmarkSolid}
                  className="fa-md lg:hidden"
                />
                <div className="underline">
                  {t("pages.publicProfilePage.saved")}
                </div>
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="fa-lg hidden lg:flex "
                />
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="fa-md lg:hidden "
                />
                <div className="underline">
                  {t("pages.publicProfilePage.save")}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {updateProfileModal()}
    </>
  );
};

export { PublicProfileHeader };
