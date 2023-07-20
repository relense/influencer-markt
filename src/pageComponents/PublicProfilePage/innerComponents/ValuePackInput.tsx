import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightRotate,
  faCalendar,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

import { useOutsideClick } from "../../../utils/helper";
import type { Option, ValuePack } from "../../../utils/globalTypes";

const ValuePackInput = (params: {
  valuePack: ValuePack | undefined;
  platform: Option;
  allValuePacks: ValuePack[];
  onChangeValuePack: (valuePack: ValuePack) => void;
}) => {
  const [isValuePackModalOpen, setIsValuePackModal] = useState<boolean>(false);
  const [availableValuePacks, setAvailableValuePacks] = useState<ValuePack[]>(
    []
  );
  const { t } = useTranslation();
  const valuePackRef = useRef(null);

  useOutsideClick(() => {
    if (isValuePackModalOpen === false) return;

    setIsValuePackModal(false);
  }, valuePackRef);

  useEffect(() => {
    const currentlyAvailableValuePacks =
      params.allValuePacks
        ?.filter((valuePack) => {
          return valuePack.platform?.id === params.platform.id;
        })
        .map((valuePack) => {
          return {
            id: valuePack.id,
            deliveryTime: valuePack.deliveryTime,
            numberOfRevisions: valuePack.numberOfRevisions,
            platform: valuePack.platform,
            valuePackPrice: valuePack.valuePackPrice,
            contentType: valuePack.contentType,
          };
        }) || [];

    setAvailableValuePacks(currentlyAvailableValuePacks);
  }, [params.platform, params.allValuePacks]);

  let containerClasses =
    "relative flex flex-1 cursor-pointer flex-col gap-4 py-4";
  if (isValuePackModalOpen) {
    containerClasses =
      "relative flex flex-1 cursor-pointer flex-col gap-4 py-4 border-blue-700 border-[1px] rounded-b-2xl";
  }

  return (
    <div
      className="w-full xl:h-32"
      onClick={() => {
        setIsValuePackModal(!isValuePackModalOpen);
      }}
    >
      <div className={containerClasses} ref={valuePackRef}>
        <div className="relative flex flex-1 justify-between gap-6 px-4">
          <div>
            {isValuePackModalOpen ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
              />
            )}
          </div>
        </div>
        {params.valuePack && params.platform && (
          <div className="flex flex-col items-start gap-2 px-4 text-sm font-medium text-gray2 xl:flex-row">
            <div className="flex gap-2">
              <FontAwesomeIcon
                icon={faCalendar}
                className="fa-lg cursor-pointer"
              />
              <div>
                {params.valuePack.deliveryTime !== ""
                  ? t("components.valuePackInput.daysDelivery", {
                      count: parseInt(params.valuePack.deliveryTime),
                    })
                  : ""}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faArrowRightRotate}
                className="fa-lg cursor-pointer"
              />
              <div>
                {params.valuePack.numberOfRevisions !== ""
                  ? t("components.valuePackInput.revision", {
                      count: parseInt(params.valuePack.deliveryTime),
                    })
                  : ""}{" "}
              </div>
            </div>
          </div>
        )}
      </div>
      {isValuePackModalOpen && params.platform?.id > 0 && (
        <div className="relative z-50 flex max-h-96 flex-1 flex-col gap-4 overflow-y-auto rounded-2xl border-[1px] border-gray3 bg-white p-4">
          {availableValuePacks.map((valuePack) => {
            return (
              <div
                key={valuePack.id}
                className="cursor-pointer rounded-2xl hover:border-influencer-green hover:bg-influencer-green-light"
                onClick={() => {
                  setIsValuePackModal(false);
                  // params.onChangeValuePack({
                  //   id: valuePack.id,
                  //   deliveryTime: valuePack.deliveryTime,
                  //   numberOfRevisions: valuePack.numberOfRevisions,
                  //   platform: valuePack.platform,
                  //   valuePackPrice: valuePack.valuePackPrice,
                  // });
                }}
              >
                {/* <ValuePack
                  deliveryTime={valuePack.deliveryTime}
                  description={valuePack.description}
                  numberOfRevisions={valuePack.numberOfRevisions}
                  title={valuePack.title}
                  valuePackPrice={valuePack.valuePackPrice}
                  closeButton={false}
                  selected={valuePack.id === params.valuePack?.id}
                /> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { ValuePackInput };
