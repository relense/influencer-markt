import { useEffect, useState } from "react";
import {
  Controller,
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
import { type Option } from "../components/CustomMultiSelect/CustomMultiSelect";

import { StepsReminder } from "../components/StepsReminder/StepsReminder";
import { CustomSelect } from "../components/CustomSelect/CustomSelect";
import { Modal } from "../components/Modal/Modal";
import { Button } from "../components/Button/Button";
import { type ValuePacksData } from "../pages/first-steps";

export type ValuePack = {
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
  changeStep: (value: "next" | "previous") => void;
  socialMedias: SocialMedia[] | undefined;
}) => {
  const [valuePacks, setValuePacks] = useState<ValuePack[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { control, register, handleSubmit, reset, setValue } =
    useForm<ValuePack>({
      defaultValues: {
        platform: { id: -1, option: "" },
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

  const onRemoveValuePack = (valuePack: ValuePack) => {
    const valuePacksArray = [...valuePacks];
    const index = getIndexFromArrayOfObjects(valuePacksArray, valuePack);

    valuePacksArray.splice(index, 1);
    setValuePacks(valuePacksArray);
    params.setValue("valuePacks", valuePacksArray);
  };

  const getIndexFromArrayOfObjects = (arr: ValuePack[], option: ValuePack) => {
    const stringArray = arr.map((item) => {
      return item.description;
    });

    return stringArray.indexOf(option.description);
  };

  const editValuePack = (valuePack: ValuePack) => {
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
                {pack.platform.option}
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

  const valuePackBuildModal = () => {
    return (
      <Modal onClose={() => onCloseModal()}>
        <form
          id="pack-form"
          onSubmit={onAddValuePack}
          className="flex h-full w-full flex-col items-center gap-4 sm:w-full sm:px-8"
        >
          <div>Value Pack Builder</div>
          <input
            {...register("title")}
            required
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Value Pack Title: Provide a catchy and descriptive title for your offering"
            autoComplete="off"
          />
          <Controller
            name="platform"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="platform"
                  placeholder="Select the social media platform for your value pack"
                  options={params.socialMedias?.map((socialMedia) => {
                    return { id: socialMedia.id, option: socialMedia.name };
                  })}
                  handleOptionSelect={onChange}
                  value={value}
                />
              );
            }}
          />
          <textarea
            {...register("description")}
            required
            className="box-border min-h-[10rem] w-full overflow-visible rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 sm:h-48 sm:min-h-[unset]"
            placeholder="Value Pack Description: Tell us about the unique offering in your package"
            autoComplete="off"
          />
          <input
            {...register("deliveryTime", { valueAsNumber: true })}
            required
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Delivery Time E.g 4 days"
            autoComplete="off"
          />
          <input
            {...register("numberOfRevisions", { valueAsNumber: true })}
            required
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Number of Revisions E.g 1"
            autoComplete="off"
          />
          <input
            {...register("valuePackPrice", { valueAsNumber: true })}
            required
            type="number"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Value Pack Price"
            autoComplete="off"
          />
          <Button type="submit" title="Add Value Pack" level="primary" />
        </form>
      </Modal>
    );
  };

  return (
    <>
      <form id="form-hook" />
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
        {isModalOpen && valuePackBuildModal()}
      </div>
    </>
  );
};
