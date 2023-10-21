import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import type { SocialMediaDetails } from "../utils/globalTypes";
import { helper } from "../utils/helper";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useState } from "react";

const SocialMediaCard = (params: {
  socialMedia: SocialMediaDetails;
  onDelete: () => void;
  onClick: () => void;
  showDeleteModal: boolean;
}) => {
  const { t } = useTranslation();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const handleSubmit = () => {
    setOpenDeleteModal(false);
    params.onDelete();
  };

  return (
    <>
      <div className="relative w-full cursor-pointer px-4 sm:px-0 lg:flex-[0_1_47%]">
        <div
          className="flex h-full w-auto flex-col gap-4 rounded-lg border-[1px] border-gray3 p-4"
          onClick={params.onClick}
        >
          <div className="flex items-center gap-1 font-semibold text-influencer">
            {params.socialMedia.platform.name}
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
                        {t(
                          `general.contentTypes.${
                            valuePack.contentType.name.charAt(0).toLowerCase() +
                            valuePack.contentType.name.slice(1)
                          }`
                        )}
                      </div>
                    </div>
                    <div className="self-end font-medium">
                      {helper.formatNumber(
                        helper.calculerMonetaryValue(valuePack.valuePackPrice)
                      )}
                      €
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
