import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightRotate, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

import { useTranslation } from "react-i18next";
import type { SocialMediaDetails } from "../utils/globalTypes";

const SocialMediaCard = (params: {
  socialMedia: SocialMediaDetails;
  onDelete: () => void;
  onClick: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full flex-1 px-4 sm:w-5/12 sm:px-0 lg:h-auto lg:flex-[0_1_49%]">
      <div
        className="flex w-auto cursor-default flex-col gap-4 rounded-lg border-[1px] border-gray3 p-4 sm:h-auto"
        onClick={params.onClick}
      >
        <div className="font-semibold text-influencer">
          {params.socialMedia.platform.name}
        </div>
        <div className="flex flex-col gap-2 xs:flex-row xs:gap-4">
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
            {params.socialMedia.socialMediaFollowers}
          </div>
        </div>
        {params.socialMedia.valuePacks &&
          params.socialMedia.valuePacks.map((valuePack) => {
            return (
              <div
                className="flex flex-1 justify-between"
                key={
                  params.socialMedia.platform.name + valuePack.contentType.name
                }
              >
                <div className="flex flex-col items-start gap-2 text-sm font-medium text-gray2 lg:items-center xl:flex-row">
                  <div className="text-base font-medium text-black">
                    {valuePack.contentType.name}
                  </div>
                  <div className="flex gap-2">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="fa-lg cursor-pointer"
                    />
                    <div>
                      {t("components.socialMediaCard.daysDelivery", {
                        count: parseInt(valuePack.deliveryTime),
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faArrowRightRotate}
                      className="fa-lg cursor-pointer"
                    />
                    <div>
                      {t("components.socialMediaCard.revision", {
                        count: parseInt(valuePack.numberOfRevisions),
                      })}
                    </div>
                  </div>
                </div>
                <div className="self-end font-semibold">
                  {valuePack.valuePackPrice}€
                </div>
              </div>
            );
          })}
      </div>
      <div
        className="absolute right-2 top-[-8px] flex h-8 w-8 cursor-pointer items-center justify-center  rounded-full bg-influencer-green sm:right-[-5px] sm:top-[-5px]"
        onClick={params.onDelete}
      >
        <FontAwesomeIcon icon={faXmark} className="fa-lg text-white" />
      </div>
    </div>
  );
};

export { SocialMediaCard };
