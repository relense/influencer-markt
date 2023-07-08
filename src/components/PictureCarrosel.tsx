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

import Image from "next/image";
import { toast } from "react-hot-toast";
import { usePrevious } from "../utils/helper";
import { useTranslation } from "react-i18next";

export type Picture = {
  id: number;
  url: string;
};

export const PictureCarrosel = (params: {
  visual: boolean;
  portfolio: Picture[] | [];
  addPicture?: (pictureUrl: string) => void;
  deletePicture?: (pictureId: number) => void;
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [currentPicture, setCurrentPicture] = useState<Picture>({
    id: -1,
    url: "",
  });
  const [currentPictureIndex, setCurrentPictureIndex] = useState<number>(0);

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
        setCurrentPicture(params.portfolio[0] || { id: -1, url: "" });
        setCurrentPictureIndex(0);
      } else if (prevPortfolio.length > params.portfolio.length) {
        //means a picture was removed
        const newPictureList: Picture[] = [...prevPortfolio];
        let newIndex = 0;

        if (prevCurrentPictureIndex) {
          newIndex =
            prevCurrentPictureIndex < newPictureList.length - 1
              ? prevCurrentPictureIndex
              : prevCurrentPictureIndex - 1;
        }
        setCurrentPictureIndex(newIndex);
        setCurrentPicture(params.portfolio[newIndex] || { id: -1, url: "" });
      } else if (prevPortfolio.length < params.portfolio.length) {
        // means a picture was added
        setCurrentPicture(
          params.portfolio[params.portfolio.length - 1] || { id: -1, url: "" }
        );
        setCurrentPictureIndex(params.portfolio.length - 1);
      }
    } else if (!prevPortfolio || prevPathname !== pathname) {
      setCurrentPicture(params.portfolio[0] || { id: -1, url: "" });
      setCurrentPictureIndex(0);
    }

    console.log(prevCurrentPictureIndex);
  }, [
    currentPicture.id,
    currentPicture.url,
    params.portfolio,
    pathname,
    prevCurrentPictureIndex,
    prevPathname,
    prevPortfolio,
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && (file.name.includes("jpeg") || file.name.includes("png"))) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;

        if (
          currentPicture.url !== dataURL &&
          params.portfolio.map((picture) => picture.url).indexOf(dataURL) === -1
        ) {
          //this is only until we have azure connected. When azure is connected we will upload to azure.
          //After uploading to azure we will use that link to update here
          //dataURL is the one that will have the picture uploaded in base64. Upload this to azure
          const picture =
            "https://images.unsplash.com/photo-1629318986794-e7e9c9890016?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=654&q=80";
          if (params.addPicture) {
            params.addPicture(picture);
          }
        }
      };

      reader.readAsDataURL(file);
    } else {
      toast.error(t("components.pictureCarrosel.invalidPictureWarning"), {
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  const handleRemovePicture = () => {
    if (params.deletePicture) {
      params.deletePicture(currentPicture.id);
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

    const newCurrentPicture = params.portfolio[newIndex] || { id: -1, url: "" };
    setCurrentPicture(newCurrentPicture);
  };

  const onHandleCarroselClick = (picture: Picture) => {
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
        <div className="relative flex h-full w-full cursor-pointer gap-4 rounded-lg border-[1px] border-gray3 sm:h-[540px] sm:w-[430px]">
          <div className="relative flex h-[540px] w-full flex-col items-center justify-center ">
            <input
              type="file"
              onChange={handleFileUpload}
              title=""
              className="absolute h-full w-full cursor-pointer text-[0px] opacity-0"
            />
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
            <div className="flex items-center justify-center gap-2 text-center text-influencer sm:gap-4">
              <div className="hidden sm:flex">
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
              </div>
              <div className="flex flex-wrap overflow-hidden p-4">
                {t("components.pictureCarrosel.addPicture")}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderMainPicture = () => {
    if (currentPicture.id !== -1) {
      return (
        <div className="relative flex h-[340px] flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray3 sm:h-[540px] sm:w-[430px]">
          {!params.visual && (
            <div
              className="absolute right-[-10px] top-[-10px] flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-full bg-influencer-green"
              onClick={() => handleRemovePicture()}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className=" fa-lg cursor-pointer text-white"
              />
            </div>
          )}
          <div className="flex h-full flex-col items-center justify-center self-center sm:h-[540px] sm:w-[430px]">
            {params.portfolio.length > 1 && (
              <div className="absolute top-2 rounded-full bg-black px-4 py-1 text-sm text-white opacity-30">
                {currentPictureIndex + 1} / {params.portfolio.length}
              </div>
            )}
            {params.portfolio.length > 1 &&
              currentPictureIndex < params.portfolio.length - 1 && (
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="fa-xl absolute right-2 cursor-pointer text-white"
                  onClick={() => handleNextPicture(true)}
                />
              )}
            {params.portfolio.length > 1 && currentPictureIndex > 0 && (
              <FontAwesomeIcon
                icon={faCircleLeft}
                className="fa-xl absolute left-2 cursor-pointer text-white"
                onClick={() => handleNextPicture(false)}
              />
            )}

            <div className="absolute bottom-2 flex items-center justify-center gap-4">
              {params.portfolio.map(({}, index) => {
                let colorClass = "h-2 w-2 rounded-full bg-gray2";

                if (currentPictureIndex === index) {
                  colorClass = "h-2 w-2 rounded-full bg-white";
                }

                return <div key={index} className={colorClass} />;
              })}
            </div>
            {currentPicture.url && (
              <Image
                src={currentPicture?.url || ""}
                alt="Uploaded Image"
                width={540}
                height={430}
                className="h-full rounded-lg object-cover"
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
        <div className="hidden gap-2 overflow-x-auto xs:flex">
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
                      className="h-14 rounded-lg object-cover"
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
            <div className="ml-[-10px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-influencer text-white">
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
    <div className="flex flex-col gap-4">
      {renderUploadMainPicture()}
      {renderMainPicture()}
      {renderPictureCarrosel()}
    </div>
  );
};
