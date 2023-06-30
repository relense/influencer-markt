import { useEffect, useState } from "react";
import {
  type UseFormGetValues,
  type UseFormSetValue,
  useForm,
} from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightRotate,
  faCalendar,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { type SocialMedia } from "@prisma/client";
import { type Option } from "../../../components/CustomMultiSelect/CustomMultiSelect";
import { StepsReminder } from "../../../components/StepsReminder/StepsReminder";
import { type ValuePacksData } from "../FirstStepsPage";
import { AddValuePackModal } from "../../../components/AddValuePackModal/AddValuePackModal";

export type ValuePackType = {
  id?: number;
  title: string;
  platform: Option;
  description: string;
  deliveryTime: number;
  numberOfRevisions: number;
  valuePackPrice: number;
};

export const Step4 = (params: {
  setValue: UseFormSetValue<ValuePacksData>;
  getValues: UseFormGetValues<ValuePacksData>;
  submit: () => void;
  changeStep: (value: "next" | "previous") => void;
  socialMedias: SocialMedia[] | undefined;
}) => {
  const [valuePacks, setValuePacks] = useState<ValuePackType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { control, register, handleSubmit, reset, setValue } =
    useForm<ValuePackType>({
      defaultValues: {
        platform: { id: -1, name: "" },
      },
    });

  useEffect(() => {
    const valuePacks = params.getValues("valuePacks");

    if (valuePacks) {
      setValuePacks(valuePacks);
    }
  }, [params]);

  const onAddValuePack = handleSubmit((data) => {
    const valuePacksArray = [...valuePacks];
    valuePacksArray.push(data);

    setValuePacks(valuePacksArray);
    params.setValue("valuePacks", valuePacksArray);
    reset();
    setIsModalOpen(false);
  });

  const onRemoveValuePack = (valuePack: ValuePackType) => {
    const valuePacksArray = [...valuePacks];
    const index = getIndexFromArrayOfObjects(valuePacksArray, valuePack);

    valuePacksArray.splice(index, 1);
    setValuePacks(valuePacksArray);
    params.setValue("valuePacks", valuePacksArray);
  };

  const getIndexFromArrayOfObjects = (
    arr: ValuePackType[],
    option: ValuePackType
  ) => {
    const stringArray = arr.map((item) => {
      return item.description;
    });

    return stringArray.indexOf(option.description);
  };

  const editValuePack = (valuePack: ValuePackType) => {
    setValue("deliveryTime", valuePack.deliveryTime);
    setValue("description", valuePack.description);
    setValue("numberOfRevisions", valuePack.numberOfRevisions);
    setValue("platform", valuePack.platform);
    setValue("title", valuePack.title);
    setValue("valuePackPrice", valuePack.valuePackPrice);
    setIsModalOpen(true);
  };

  const valuePackList = () => {
    return valuePacks.map((pack, index) => {
      return (
        <div
          key={index}
          className="relative w-full cursor-pointer px-4 sm:h-full sm:w-5/12 sm:px-0"
        >
          <div
            className="flex w-full flex-col gap-4 rounded-lg border-[1px] border-gray3 p-4 sm:h-full"
            onClick={() => editValuePack(pack)}
          >
            <div className="flex justify-between gap-4">
              <div className="text-xs font-semibold">{pack.title}</div>
              <div className="text-xs font-semibold text-influencer">
                {pack.platform.name}
              </div>
            </div>
            <div className="flex break-words font-extralight sm:flex-1">
              {pack.description}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-2 text-sm font-medium text-gray2 xl:flex-row">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="fa-lg cursor-pointer"
                  />
                  <div>{pack.deliveryTime} Days Delivery</div>
                </div>

                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faArrowRightRotate}
                    className="fa-lg cursor-pointer"
                  />
                  <div>{pack.numberOfRevisions} Revisions</div>
                </div>
              </div>
              <div className="self-end font-semibold sm:self-center">
                {pack.valuePackPrice}€
              </div>
            </div>
          </div>
          <div
            className="absolute right-2 top-[-10px] z-10 flex h-8 w-8 cursor-pointer items-center justify-center  rounded-full bg-influencer-green sm:right-[-10px] sm:top-[-12px]"
            onClick={() => onRemoveValuePack(pack)}
          >
            <FontAwesomeIcon icon={faXmark} className="fa-lg text-white" />
          </div>
        </div>
      );
    });
  };

  const onCloseModal = () => {
    reset();
    setIsModalOpen(false);
  };

  return (
    <>
      <form id="form-hook" onSubmit={params.submit} />
      <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="ml-[-10px] flex h-7 w-7 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-lg cursor-pointer " />
          </div>
          <div className="text-base underline">Add Value Pack</div>
        </div>
        <div className="flex w-full flex-wrap justify-center gap-4">
          {valuePackList()}
        </div>
        <StepsReminder />
        {isModalOpen && (
          <AddValuePackModal
            control={control}
            onAddValuePack={onAddValuePack}
            onCloseModal={onCloseModal}
            register={register}
            socialMedias={params.socialMedias}
          />
        )}
      </div>
    </>
  );
};
