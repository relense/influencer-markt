import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import type { SocialMediaDetails } from "../utils/globalTypes";
import { helper } from "../utils/helper";

const SocialMediaCard = (params: {
  socialMedia: SocialMediaDetails;
  onDelete: () => void;
  onClick: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full px-4 sm:px-0 lg:flex-[0_1_47%]">
      <div
        className="flex h-auto w-auto cursor-default flex-col gap-4 rounded-lg border-[1px] border-gray3 p-4"
        onClick={params.onClick}
      >
        <div className="font-semibold text-influencer">
          {params.socialMedia.platform.name}
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
            {helper.formatNumber(params.socialMedia.socialMediaFollowers)}
          </div>
        </div>
        {params.socialMedia.valuePacks && (
          <div className="flex flex-wrap gap-2">
            {params.socialMedia.valuePacks.map((valuePack, index) => {
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
                      {valuePack.contentType.name}
                    </div>
                  </div>
                  <div className="self-end font-medium">
                    {helper.formatNumber(parseInt(valuePack.valuePackPrice))}€
                  </div>
                  {params.socialMedia.valuePacks.length - 1 !== index && (
                    <div className="h-1 w-1 rounded-full bg-black" />
                  )}
                </div>
              );
            })}
          </div>
        )}
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
