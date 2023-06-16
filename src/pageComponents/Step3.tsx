import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCamera,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { StepsReminder } from "../components/StepsReminder/StepsReminder";
import Image from "next/image";

export const Step3 = (params: { pictures: string[] }) => {
  const [currentPicture, setCurrentPicture] = useState<string>();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result as string;
        setCurrentPicture(dataURL);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-2 flex flex-1 flex-col gap-4 lg:mt-11">
      {!currentPicture && (
        <div className="relative flex h-full cursor-pointer flex-col items-center justify-center gap-4 self-center rounded-lg border-[1px] border-gray3 p-4 sm:h-[540px] sm:w-[430px]">
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute h-full w-full opacity-0"
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
      )}
      {currentPicture && (
        <div className="relative flex h-full cursor-pointer flex-col items-center justify-center gap-4 self-center rounded-lg border-[1px] border-gray3 sm:h-[540px] sm:w-[430px]">
          <div
            className="absolute right-[-10px] top-[-10px] flex h-14 w-14 cursor-pointer items-center justify-center self-end rounded-full bg-red-600"
            onClick={() => setCurrentPicture("")}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="fa-2x cursor-pointer text-white"
            />
          </div>
          <div className="flex h-full cursor-pointer flex-col items-center justify-center self-center sm:h-[540px] sm:w-[430px]">
            <Image
              src={currentPicture}
              alt="Uploaded Image"
              width={540}
              height={430}
              className="h-full rounded-lg object-cover"
            />
          </div>
        </div>
      )}

      <div className="relative flex justify-center gap-6">
        <div className="flex items-center">
          <div className="flex h-14 w-28 cursor-pointer items-center justify-center rounded-lg border-[1px] border-gray3">
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center">
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
          </div>
          <div className="ml-[-10px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-sm" />
          </div>
        </div>
      </div>
      <StepsReminder />
    </div>
  );
};
