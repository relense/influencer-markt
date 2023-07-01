import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightRotate, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

import { type SocialMedia } from "@prisma/client";

const ValuePack = (params: {
  title: string;
  selected?: boolean;
  socialMedia?: SocialMedia;
  description: string;
  valuePackPrice: number;
  deliveryTime: number;
  numberOfRevisions: number;
  closeButton: boolean;
  onDeleteValuePack?: () => void;
}) => {
  let selected = "";

  if (params.selected) {
    selected =
      "relative flex flex-col gap-4 rounded-2xl border-[1px] border-influencer-green p-4 bg-influencer-green text-white";
  } else {
    selected =
      "relative flex flex-col gap-4 rounded-2xl border-[1px] border-gray3 p-4";
  }

  return (
    <div className={selected}>
      <div className="flex justify-between gap-4">
        <div className="text-xs font-semibold">{params.title}</div>
        <div className="text-xs font-semibold text-influencer">
          {params.socialMedia && params.socialMedia?.name}
        </div>
      </div>
      <div>{params.description}</div>
      <div className="flex flex-1 justify-between">
        <div className="flex flex-col items-start gap-2 text-sm font-medium text-gray2 xl:flex-row">
          <div className="flex gap-2">
            <FontAwesomeIcon
              icon={faCalendar}
              className="fa-lg cursor-pointer"
            />
            <div>{params.deliveryTime} Days Delivery</div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faArrowRightRotate}
              className="fa-lg cursor-pointer"
            />
            <div>{params.numberOfRevisions} Of Revisions</div>
          </div>
        </div>
        <div className="self-end font-semibold">{params.valuePackPrice}€</div>
      </div>
      {params.closeButton && (
        <div
          className="absolute right-[-8px] top-[-10px] z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full  bg-influencer-green sm:top-[-8px]"
          onClick={params.onDeleteValuePack}
        >
          <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={faXmark} className="fa-sm text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export { ValuePack };
