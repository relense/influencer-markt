import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "../../../utils/helper";
import { type ValuePackType } from "../../FirstStepsPage/Views/Step4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightRotate,
  faCalendar,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { type Option } from "../../../components/CustomMultiSelect";
import { ValuePack } from "../../../components/ValuePack";

const ValuePackInput = (params: {
  valuePack: ValuePackType | undefined;
  platform: Option;
  allValuePacks: ValuePackType[];
  onChangeValuePack: (valuePack: ValuePackType) => void;
}) => {
  const [isValuePackModalOpen, setIsValuePackModal] = useState<boolean>(false);
  const [availableValuePacks, setAvailableValuePacks] = useState<
    ValuePackType[]
  >([]);
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
            description: valuePack.description,
            numberOfRevisions: valuePack.numberOfRevisions,
            platform: valuePack.platform,
            title: valuePack.title,
            valuePackPrice: valuePack.valuePackPrice,
          };
        }) || [];

    setAvailableValuePacks(currentlyAvailableValuePacks);
  }, [params.platform, params.allValuePacks]);

  return (
    <div
      className="w-full xl:h-32"
      onClick={() => {
        setIsValuePackModal(!isValuePackModalOpen);
      }}
    >
      <div
        className="relative flex flex-1 cursor-pointer flex-col gap-4 py-4"
        ref={valuePackRef}
      >
        {params.valuePack && params.valuePack.id !== -1 ? (
          <div className="px-4 text-sm font-semibold">
            {params.valuePack.title}
          </div>
        ) : (
          <div className="px-4 text-sm font-semibold">Value pack</div>
        )}
        <div className="relative flex flex-1 justify-between gap-6 px-4">
          {params.valuePack && params.valuePack.id !== -1 ? (
            <div className="w-96 overflow-hidden text-ellipsis whitespace-nowrap">
              {params.valuePack.description}
            </div>
          ) : (
            <div className="w-96 overflow-hidden text-ellipsis whitespace-nowrap text-gray2">
              Please choose a value pack
            </div>
          )}
          <div>
            {isValuePackModalOpen ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                className="pointer-events-none absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform"
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                className="pointer-events-none absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform"
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
                {params.valuePack.deliveryTime !== -1
                  ? params.valuePack.deliveryTime
                  : ""}{" "}
                Days Delivery
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faArrowRightRotate}
                className="fa-lg cursor-pointer"
              />
              <div>
                {params.valuePack.numberOfRevisions !== -1
                  ? params.valuePack.numberOfRevisions
                  : ""}{" "}
                Of Revisions
              </div>
            </div>
          </div>
        )}
      </div>
      {isValuePackModalOpen && params.platform?.id > 0 && (
        <div className="relative flex max-h-96 flex-1  flex-col gap-4 overflow-y-auto rounded-2xl border-[1px] border-gray3 bg-white p-4">
          {availableValuePacks.map((valuePack) => {
            return (
              <div
                key={valuePack.id}
                className="cursor-pointer rounded-2xl hover:border-influencer-green hover:bg-influencer-green-light"
                onClick={() => {
                  setIsValuePackModal(false);
                  params.onChangeValuePack({
                    id: valuePack.id,
                    deliveryTime: valuePack.deliveryTime,
                    description: valuePack.description,
                    numberOfRevisions: valuePack.numberOfRevisions,
                    platform: valuePack.platform,
                    title: valuePack.title,
                    valuePackPrice: valuePack.valuePackPrice,
                  });
                }}
              >
                <ValuePack
                  deliveryTime={valuePack.deliveryTime}
                  description={valuePack.description}
                  numberOfRevisions={valuePack.numberOfRevisions}
                  title={valuePack.title}
                  valuePackPrice={valuePack.valuePackPrice}
                  closeButton={false}
                  selected={valuePack.id === params.valuePack?.id}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { ValuePackInput };
