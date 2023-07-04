import { useEffect, useState } from "react";
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

type Picture = {
  id: number;
  url: string;
};

export const PictureCarrosel = (params: {
  visual: boolean;
  portfolio: Picture[] | [];
}) => {
  const [currentPicture, setCurrentPicture] = useState<Picture>({
    id: -1,
    url: "",
  });
  const [pictureList, setPictureList] = useState<Picture[]>([]);

  useEffect(() => {
    if (params.portfolio && params.portfolio.length > 0) {
      setPictureList(params.portfolio);
      setCurrentPicture(params.portfolio[0] || { id: -1, url: "" });
    }
  }, [params.portfolio]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && (file.name.includes("jpeg") || file.name.includes("png"))) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;

        if (
          currentPicture.url !== dataURL &&
          pictureList.map((picture) => picture.url).indexOf(dataURL) === -1
        ) {
          setCurrentPicture({ id: 0, url: dataURL });
          const newPictureList = [...pictureList];
          newPictureList.push({ id: 0, url: dataURL });
          setPictureList(newPictureList);
        }
      };

      reader.readAsDataURL(file);
    } else {
      toast.error("Picture must be jpeg or png", {
        duration: 5000,
        position: "top-right",
      });
    }
  };

  const handleRemovePicture = () => {
    let newPictureList: Picture[] = [...pictureList];
    const index = newPictureList
      .map((picture) => picture.url)
      .indexOf(currentPicture.url);

    if (index > -1) {
      newPictureList = removeItemOnce(pictureList, currentPicture);
      setCurrentPicture({ id: -1, url: "" });
      const newIndex = index < newPictureList.length ? index : index - 1;
      const newCurrentPicture = newPictureList[newIndex] || { id: -1, url: "" };
      setCurrentPicture(newCurrentPicture);
    }
  };

  const removeItemOnce = (arr: Picture[], value: Picture) => {
    const index = arr.map((picture) => picture.url).indexOf(value.url);
    if (index > -1) {
      arr.splice(index, 1);
    }

    return arr;
  };

  const handleNextPicture = (next: boolean) => {
    const index = pictureList
      .map((picture) => picture.url)
      .indexOf(currentPicture.url);
    let newIndex = index;

    if (next && index < pictureList.length) {
      newIndex = index + 1;
    } else if (!next && index > 0) {
      newIndex = index - 1;
    }

    const newCurrentPicture = pictureList[newIndex] || { id: -1, url: "" };
    setCurrentPicture(newCurrentPicture);
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
                Add your Profile Image
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderMainPicture = () => {
    const currentPictureIndex = pictureList
      .map((picture) => picture.url)
      .indexOf(currentPicture.url);

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
            {pictureList.length > 1 && (
              <div className="absolute top-2 rounded-full bg-black px-4 py-1 text-sm text-white opacity-30">
                {currentPictureIndex + 1} / {pictureList.length}
              </div>
            )}
            {pictureList.length > 1 &&
              currentPictureIndex < pictureList.length - 1 && (
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="fa-xl absolute right-2 cursor-pointer text-white"
                  onClick={() => handleNextPicture(true)}
                />
              )}
            {pictureList.length > 1 && currentPictureIndex > 0 && (
              <FontAwesomeIcon
                icon={faCircleLeft}
                className="fa-xl absolute left-2 cursor-pointer text-white"
                onClick={() => handleNextPicture(false)}
              />
            )}

            <div className="absolute bottom-2 flex items-center justify-center gap-4">
              {pictureList.map(({}, index) => {
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
          {pictureList &&
            pictureList.map((picture) => {
              return (
                <div
                  key={picture.url}
                  className="h-14 cursor-pointer"
                  onClick={() => setCurrentPicture(picture)}
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
        {pictureList.length < 4 && !params.visual && (
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
