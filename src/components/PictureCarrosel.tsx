import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCamera,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleLeft,
  faCircleRight,
} from "@fortawesome/free-regular-svg-icons";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

import { type PreloadedImage, usePrevious } from "../utils/helper";
import { Modal } from "./Modal";
import { Button } from "./Button";

export const PictureCarrosel = (params: {
  visual: boolean;
  showDeleteModal: boolean;
  portfolio: PreloadedImage[] | [];
  addPicture?: (pictureUrl: string) => void;
  deletePicture?: (pictureId: number) => void;
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [currentPicture, setCurrentPicture] = useState<PreloadedImage>({
    id: -1,
    url: "",
    width: 540,
    height: 430,
  });
  const [currentPictureIndex, setCurrentPictureIndex] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const prevPortfolio = usePrevious(params.portfolio);
  const prevPathname = usePrevious(pathname);
  const prevCurrentPictureIndex = usePrevious(currentPictureIndex);

  useEffect(() => {
    if (
      prevPortfolio &&
      prevPortfolio !== params.portfolio &&
      prevPathname === pathname
    ) {
      if (
        params.portfolio &&
        params.portfolio.length > 0 &&
        currentPicture.id === -1
      ) {
        setCurrentPicture(
          params.portfolio[0] || { id: -1, url: "", width: 540, height: 430 }
        );
        setCurrentPictureIndex(0);
      } else if (prevPortfolio.length > params.portfolio.length) {
        //means a picture was removed
        const newPictureList: PreloadedImage[] = [...prevPortfolio];
        let newIndex = 0;

        if (prevCurrentPictureIndex) {
          newIndex =
            prevCurrentPictureIndex < newPictureList.length - 1
              ? prevCurrentPictureIndex
              : prevCurrentPictureIndex - 1;
        }
        setCurrentPictureIndex(newIndex);
        setCurrentPicture(
          params.portfolio[newIndex] || {
            id: -1,
            url: "",
            width: 540,
            height: 430,
          }
        );
      } else if (prevPortfolio.length < params.portfolio.length) {
        // means a picture was added
        setCurrentPicture(
          params.portfolio[params.portfolio.length - 1] || {
            id: -1,
            url: "",
            width: 540,
            height: 430,
          }
        );
        setCurrentPictureIndex(params.portfolio.length - 1);
      }
    } else if (!prevPortfolio || prevPathname !== pathname) {
      setCurrentPicture(
        params.portfolio[0] || { id: -1, url: "", width: 540, height: 430 }
      );
      setCurrentPictureIndex(0);
    }
  }, [
    currentPicture.id,
    currentPicture.url,
    params.portfolio,
    pathname,
    prevCurrentPictureIndex,
    prevPathname,
    prevPortfolio,
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg") &&
      file.size <= 8000000
    ) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.onload = () => {
          const dataURL = reader.result as string;

          if (
            currentPicture.url !== dataURL &&
            params.portfolio.map((picture) => picture.url).indexOf(dataURL) ===
              -1
          ) {
            if (params.addPicture) {
              params.addPicture(dataURL);
            }
          }
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast.error(t("components.pictureCarrosel.invalidPictureWarning"), {
          duration: 5000,
          position: "bottom-left",
        });
      }
    } else {
      toast.error(t("components.pictureCarrosel.invalidPictureWarning"), {
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const handleRemovePicture = () => {
    if (params.showDeleteModal) {
      setOpenDeleteModal(true);
    } else {
      removePicture();
    }
  };

  const removePicture = () => {
    if (params.deletePicture) {
      params.deletePicture(currentPicture.id);
      setOpenDeleteModal(false);
    }
  };

  const handleNextPicture = (next: boolean) => {
    let newIndex = 0;

    if (next && currentPictureIndex < params.portfolio.length) {
      newIndex = currentPictureIndex + 1;
    } else if (!next && currentPictureIndex > 0) {
      newIndex = currentPictureIndex - 1;
    }

    setCurrentPictureIndex(newIndex);

    const newCurrentPicture = params.portfolio[newIndex] || {
      id: -1,
      url: "",
      width: 540,
      height: 430,
    };
    setCurrentPicture(newCurrentPicture);
  };

  const onHandleCarroselClick = (picture: PreloadedImage) => {
    const index = params.portfolio
      .map((picture) => picture.url)
      .indexOf(picture.url);
    const newIndex = index;

    setCurrentPicture(picture);
    setCurrentPictureIndex(newIndex);
  };

  const renderUploadMainPicture = () => {
    if (currentPicture.id === -1) {
      return (
        <div
          className={`relative flex h-full w-full gap-4 rounded-lg border-[1px] border-gray3 sm:h-[540px] sm:w-[430px] ${
            params.portfolio.length > 0 ? "cursor-pointer" : ""
          }`}
        >
          <div className="relative flex h-[540px] w-full flex-col items-center justify-center ">
            {!params.visual && (
              <input
                type="file"
                onChange={handleFileUpload}
                title=""
                className="absolute h-full w-full cursor-pointer text-[0px] opacity-0"
              />
            )}
            <div
              className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-[1px] border-gray3 ${
                params.portfolio.length > 0 ? "cursor-pointer" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
            {!params.visual && (
              <div className="flex flex-col">
                <div className="flex items-center justify-center gap-2 text-center text-influencer sm:gap-4">
                  <div className="hidden sm:flex">
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                  </div>
                  <div className="flex flex-wrap overflow-hidden p-4">
                    {t("components.pictureCarrosel.addPicture")}
                  </div>
                </div>
                <div className="flex flex-wrap overflow-hidden text-center text-influencer">
                  {t("components.pictureCarrosel.addPictureBestResults")}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  const renderMainPicture = () => {
    if (currentPicture.id !== -1) {
      return (
        <div className="relative flex h-[768px] w-full flex-col items-center justify-center gap-4 rounded-lg sm:w-[430px]">
          {!params.visual && (
            <div
              className="absolute right-[-10px] top-[-10px] flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-full bg-influencer-green"
              onClick={() => {
                handleRemovePicture();
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className=" fa-lg cursor-pointer text-white"
              />
            </div>
          )}
          <div className="flex h-full flex-col items-center justify-center self-center sm:h-[768px] sm:w-[430px]">
            {params.portfolio.length > 1 && (
              <div className="absolute top-2 rounded-full bg-black px-4 py-1 text-sm text-white opacity-30">
                {currentPictureIndex + 1} / {params.portfolio.length}
              </div>
            )}
            {params.portfolio.length > 1 &&
              currentPictureIndex < params.portfolio.length - 1 && (
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="fa-xl absolute right-2 cursor-pointer text-gray2"
                  onClick={() => handleNextPicture(true)}
                />
              )}
            {params.portfolio.length > 1 && currentPictureIndex > 0 && (
              <FontAwesomeIcon
                icon={faCircleLeft}
                className="fa-xl absolute left-2 cursor-pointer text-gray2"
                onClick={() => handleNextPicture(false)}
              />
            )}

            <div className="absolute bottom-2 flex items-center justify-center gap-4">
              {params.portfolio.map(({}, index) => {
                let colorClass =
                  "h-2 w-2 rounded-full bg-gray2 border-[1px] border-gray2";

                if (currentPictureIndex === index) {
                  colorClass =
                    "h-2 w-2 rounded-full bg-white border-[1px] border-gray2";
                }

                return <div key={index} className={colorClass} />;
              })}
            </div>
            {currentPicture.url && (
              <Image
                src={currentPicture?.url || ""}
                alt="Uploaded Image"
                width={1080}
                height={1920}
                quality={100}
                className="pointer-events-none h-full rounded-lg object-cover"
                priority
              />
            )}
          </div>
        </div>
      );
    }
  };

  const renderPictureCarrosel = () => {
    return (
      <div className="relative flex justify-center gap-2 self-center sm:mt-0 sm:self-start">
        <div className="hidden gap-2 overflow-x-auto xxs:flex">
          {params.portfolio &&
            params.portfolio.map((picture) => {
              return (
                <div
                  key={picture.url}
                  className="h-14 cursor-pointer"
                  onClick={() => onHandleCarroselClick(picture)}
                >
                  {picture.url && (
                    <Image
                      src={picture?.url || ""}
                      alt="Uploaded Image"
                      width={100}
                      height={56}
                      className="pointer-events-none h-14 rounded-lg object-cover"
                      priority
                    />
                  )}
                </div>
              );
            })}
        </div>
        {params.portfolio.length < 4 && !params.visual && (
          <div className="relative flex items-center">
            <input
              type="file"
              title=""
              onChange={handleFileUpload}
              className="absolute h-full w-full cursor-pointer text-[0px] opacity-0"
            />
            <div className="flex h-14 cursor-pointer items-center justify-center rounded-lg border-[1px] border-gray3">
              <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center">
                <FontAwesomeIcon
                  icon={faCamera}
                  className="fa-2x cursor-pointer text-gray3 "
                />
              </div>
            </div>
            <div className="ml-[-10px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-influencer text-white">
              <FontAwesomeIcon
                icon={faPlus}
                className="fa-sm cursor-pointer "
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {renderUploadMainPicture()}
        {renderMainPicture()}
        {renderPictureCarrosel()}
      </div>
      {openDeleteModal && !params.visual && (
        <div className="fixed left-[5%] z-50 w-full  justify-center md:left-[15%] lg:left-[30%] 2xl:left-[35%]">
          <Modal
            onClose={() => setOpenDeleteModal(false)}
            button={
              <div className="flex justify-center p-4">
                <Button
                  type="submit"
                  title={t(`components.pictureCarrosel.deleteButton`)}
                  level="primary"
                  form="form-warningModal"
                />
              </div>
            }
          >
            <form
              id="form-warningModal"
              onSubmit={(e) => {
                e.preventDefault();
                removePicture();
              }}
              className="flex flex-col gap-4 p-4"
            >
              <div className="text-center text-3xl font-semibold text-influencer">
                {t("components.pictureCarrosel.areYouSure")}
              </div>
              <div className="flex flex-col gap-4 text-center text-lg">
                <span>{t(`components.pictureCarrosel.deleteWarning`)}</span>
                <span>
                  {params.portfolio.length === 1 &&
                    t(`components.pictureCarrosel.lastPictureWarning`)}
                </span>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </>
  );
};
