import { useState } from "react";
import { useTranslation } from "next-i18next";
import {
  type IconDefinition,
  faGlobe,
  faPencil,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
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
import type { SocialMediaDetails } from "../utils/globalTypes";
import { helper } from "../utils/helper";
import { Modal } from "./Modal";
import { Button } from "./Button";

const SocialMediaCard = (params: {
  socialMedia: SocialMediaDetails;
  onDelete: () => void;
  onHandleEditSocialMedia: () => void;
  handleChangeMainSocialMedia: () => void;
  showDeleteModal: boolean;
}) => {
  const { t } = useTranslation();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const handleSubmit = () => {
    setOpenDeleteModal(false);
    params.onDelete();
  };

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

  return (
    <>
      <div className={"relative w-full px-4 sm:px-0 lg:flex-[0_1_47%]"}>
        <div
          className={`flex h-full w-auto cursor-pointer flex-col gap-4 rounded-lg border-[1px] p-4 ${
            params.socialMedia.mainSocialMedia
              ? "border-[2px] border-influencer-dark"
              : "border-gray3"
          }`}
          onClick={() => params.handleChangeMainSocialMedia()}
        >
          {params.socialMedia.mainSocialMedia && (
            <div className="text-sm text-gray4">
              {t("components.socialMediaCard.mainSocial")}
            </div>
          )}
          <div
            className="flex w-10 cursor-pointer items-center gap-2 font-semibold text-influencer hover:underline "
            onClick={(e) => {
              params.onHandleEditSocialMedia();
              e.stopPropagation();
            }}
          >
            <FontAwesomeIcon
              icon={socialMediaIcon(params.socialMedia.platform.name)}
              className="text-md cursor-pointer text-influencer"
            />
            <span>{params.socialMedia.platform.name}</span>
            <FontAwesomeIcon
              icon={faPencil}
              className="fa-base cursor-pointer pb-1 text-influencer"
            />
          </div>
          <div className="flex flex-col gap-2 xs:gap-4 2xl:flex-row">
            <div className="break-words">
              <span className="font-medium">
                {t("components.socialMediaCard.handler")}:
              </span>{" "}
              {params.socialMedia.socialMediaHandler}
            </div>
            <div>
              <span className="font-medium">
                {t("components.socialMediaCard.followers")}:
              </span>{" "}
              {params.socialMedia.socialMediaFollowers.name}
            </div>
          </div>
          {params.socialMedia.valuePacks && (
            <div className="flex flex-wrap gap-2">
              {params.socialMedia.valuePacks.map((valuePack, index) => {
                if (valuePack.contentType.id !== -1) {
                  return (
                    <div
                      className="flex items-center gap-2"
                      key={
                        params.socialMedia.platform.name +
                        valuePack.contentType.name
                      }
                    >
                      <div className="flex flex-col items-start gap-2 text-sm font-medium text-gray2 lg:flex-row lg:items-center">
                        <div className="text-base font-semibold  text-influencer">
                          {t(
                            `general.contentTypes.${
                              valuePack.contentType.name
                                .charAt(0)
                                .toLowerCase() +
                              valuePack.contentType.name.slice(1)
                            }`
                          )}
                        </div>
                      </div>
                      <div className="self-end font-medium">
                        {helper.calculerMonetaryValue(valuePack.valuePackPrice)}
                        €
                      </div>
                      {params.socialMedia.valuePacks.length - 1 !== index && (
                        <div className="h-1 w-1 rounded-full bg-black" />
                      )}
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
        <div
          className="absolute right-2 top-[-8px] flex h-8 w-8 cursor-pointer items-center justify-center  rounded-full bg-influencer-green sm:right-[-10px] sm:top-[-10px]"
          onClick={() => setOpenDeleteModal(true)}
        >
          <FontAwesomeIcon icon={faXmark} className="fa-lg text-white" />
        </div>
      </div>
      {openDeleteModal && (
        <div className="fixed left-[5%] z-50 w-full  justify-center md:left-[15%] lg:left-[30%] 2xl:left-[35%]">
          <Modal onClose={() => setOpenDeleteModal(false)}>
            <div className="flex flex-col gap-4 p-4">
              <div className="text-center text-3xl font-semibold text-influencer">
                {t("components.socialMediaCard.areYouSure")}
              </div>
              <div className="text-center text-lg">
                {t(`components.socialMediaCard.deleteWarning`)}
              </div>
              <div className="flex justify-center p-4">
                <Button
                  type="submit"
                  title={t(`components.socialMediaCard.deleteButton`)}
                  level="primary"
                  form="form-warningModal"
                  onClick={() => handleSubmit()}
                />
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export { SocialMediaCard };
