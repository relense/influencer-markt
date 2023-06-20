import { useState } from "react";
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

import { StepsReminder } from "../components/StepsReminder/StepsReminder";
import Image from "next/image";

export const Step3 = (params: {
  changeStep: (value: "next" | "previous") => void;
}) => {
  const [currentPicture, setCurrentPicture] = useState<string>("");
  const [pictureList, setPictureList] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;
        if (currentPicture !== dataURL && pictureList.indexOf(dataURL) === -1) {
          setCurrentPicture(dataURL);
          const newPictureList = [...pictureList];
          newPictureList.push(dataURL);
          setPictureList(newPictureList);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    let newPictureList: string[] = [...pictureList];
    const index = newPictureList.indexOf(currentPicture);

    if (index > -1) {
      newPictureList = removeItemOnce(pictureList, currentPicture);
      setCurrentPicture("");
      const newIndex = index < newPictureList.length ? index : index - 1;
      const newCurrentPicture = newPictureList[newIndex] || "";
      setCurrentPicture(newCurrentPicture);
    }
  };

  const removeItemOnce = (arr: string[], value: string) => {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }

    return arr;
  };

  const handleNextPicture = (next: boolean) => {
    const index = pictureList.indexOf(currentPicture);
    let newIndex = index;

    if (next && index < pictureList.length) {
      newIndex = index + 1;
    } else if (!next && index > 0) {
      newIndex = index - 1;
    }

    const newCurrentPicture = pictureList[newIndex] || "";
    setCurrentPicture(newCurrentPicture);
  };

  const renderUploadMainPicture = () => {
    if (!currentPicture) {
      return (
        <div className="relative flex h-full cursor-pointer gap-4 self-center rounded-lg border-[1px] border-gray3 sm:h-[540px] sm:w-[430px]">
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
    if (currentPicture) {
      return (
        <div className="relative flex h-[340px] flex-col items-center justify-center gap-4 self-center rounded-lg border-[1px] border-gray3 sm:h-[540px] sm:w-[430px]">
          <div
            className="absolute top-[-10px] flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-full bg-influencer-green sm:right-[-10px]"
            onClick={() => handleRemovePicture()}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className=" fa-lg cursor-pointer text-white"
            />
          </div>
          <div className="flex h-full flex-col items-center justify-center self-center sm:h-[540px] sm:w-[430px]">
            {pictureList.length > 1 && (
              <div className="absolute top-2 rounded-full bg-black px-4 py-1 text-sm text-white opacity-30">
                {pictureList.indexOf(currentPicture) + 1} / {pictureList.length}
              </div>
            )}
            {pictureList.length > 1 &&
              pictureList.indexOf(currentPicture) < pictureList.length - 1 && (
                <FontAwesomeIcon
                  icon={faCircleRight}
                  className="fa-xl absolute right-2 cursor-pointer text-white"
                  onClick={() => handleNextPicture(true)}
                />
              )}
            {pictureList.length > 1 &&
              pictureList.indexOf(currentPicture) > 0 && (
                <FontAwesomeIcon
                  icon={faCircleLeft}
                  className="fa-xl absolute left-2 cursor-pointer text-white"
                  onClick={() => handleNextPicture(false)}
                />
              )}

            <div className="absolute bottom-2 flex items-center justify-center gap-4">
              {pictureList.map(({}, index) => {
                let colorClass = "h-2 w-2 rounded-full bg-gray2";

                if (pictureList.indexOf(currentPicture) === index) {
                  colorClass = "h-2 w-2 rounded-full bg-white";
                }

                return <div key={index} className={colorClass} />;
              })}
            </div>
            <Image
              src={currentPicture}
              alt="Uploaded Image"
              width={540}
              height={430}
              className="h-full rounded-lg object-cover"
            />
          </div>
        </div>
      );
    }
  };

  const renderPictureCarrosel = () => {
    return (
      <div className="relative flex justify-center gap-6 sm:mt-0">
        <div className="hidden gap-6 overflow-x-auto sm:flex">
          {pictureList &&
            pictureList.map((picture) => {
              return (
                <div
                  key={picture}
                  className="h-14 w-28 cursor-pointer"
                  onClick={() => setCurrentPicture(picture)}
                >
                  <Image
                    src={picture}
                    alt="Uploaded Image"
                    width={112}
                    height={56}
                    className="h-14 w-28 rounded-lg object-cover "
                  />
                </div>
              );
            })}
        </div>
        {pictureList.length < 4 && (
          <div className="relative flex items-center">
            <input
              type="file"
              title=""
              onChange={handleFileUpload}
              className="absolute h-full w-full cursor-pointer text-[0px] opacity-0"
            />
            <div className="flex h-14 w-28 cursor-pointer items-center justify-center rounded-lg border-[1px] border-gray3">
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
    <div className="mt-2 flex flex-1 flex-col gap-4 lg:mt-11 lg:overflow-y-auto">
      <form id="form-hook" onSubmit={() => params.changeStep("next")} />
      {renderUploadMainPicture()}
      {renderMainPicture()}
      {renderPictureCarrosel()}
      <StepsReminder />
    </div>
  );
};
