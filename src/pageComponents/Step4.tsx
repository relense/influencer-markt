import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightRotate,
  faCalendar,
  faPencil,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { type SocialMedia } from "@prisma/client";
import { type Option } from "../components/CustomMultiSelect/CustomMultiSelect";

import { StepsReminder } from "../components/StepsReminder/StepsReminder";
import { CustomSelect } from "../components/CustomSelect/CustomSelect";
import { Modal } from "../components/Modal/Modal";
import { Button } from "../components/Button/Button";

type ValuePack = {
  title: string;
  platform: Option;
  description: string;
  deliveryTime: string;
  numberOfRevisions: number;
  valuePackPrice: number;
};

export const Step4 = (params: {
  changeStep: (value: "next" | "previous") => void;
  socialMedias: SocialMedia[] | undefined;
}) => {
  const [valuePacks, setValuePacks] = useState<ValuePack[]>([]);
  const [currentValuePack, setCurrentValuePack] = useState<ValuePack>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValuePack>({
    defaultValues: {
      platform: { id: -1, option: "" },
    },
  });

  const onAddValuePack = handleSubmit((data) => {
    const valuePacksArray = [...valuePacks];
    valuePacksArray.push(data);

    setValuePacks(valuePacksArray);
    reset();
    setIsModalOpen(false);
  });

  const sendPacks = () => {
    params.changeStep("next");
  };

  const editValuePack = (valeuPack: ValuePack, index: number) => {
    setCurrentValuePack(valeuPack);
    setIsModalOpen(true);
  };

  const valuePackList = () => {
    return valuePacks.map((pack, index) => {
      return (
        <div
          key={index}
          className="relative w-full px-4 sm:h-full sm:w-5/12 sm:px-0"
        >
          <div className="flex w-full flex-col gap-4 rounded-lg border-[1px] border-gray3 p-4 sm:h-full">
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
            className="absolute right-2 top-[-8px] flex cursor-pointer items-center justify-center rounded-full bg-white text-influencer  sm:right-[-5px] sm:top-[-5px]"
            onClick={() => editValuePack(pack, index)}
          >
            <FontAwesomeIcon icon={faPencil} className="fa-lg" />
          </div>
        </div>
      );
    });
  };

  const valuePackBuildModal = () => {
    return (
      <Modal onClose={() => setIsModalOpen(false)}>
        <form
          id="pack-form"
          onSubmit={onAddValuePack}
          className="flex h-full w-full flex-col items-center gap-4 sm:w-full sm:px-8"
        >
          <div>Value Pack Builder</div>
          <input
            {...register("title")}
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Value Pack Title: Provide a catchy and descriptive title for your offering"
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
            className="box-border min-h-[10rem] w-full overflow-visible rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 sm:h-48 sm:min-h-[unset]"
            placeholder="Value Pack Description: Tell us about the unique offering in your package"
          />
          <input
            {...register("deliveryTime")}
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Delivery Time E.g 4 days"
          />
          <input
            {...register("numberOfRevisions")}
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Number of Revisions E.g 1"
          />
          <input
            {...register("valuePackPrice")}
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Value Pack Price"
          />
          <Button type="submit" title="Add Value Pack" level="primary" />
        </form>
      </Modal>
    );
  };

  return (
    <>
      <form id="form-hook" onSubmit={() => sendPacks()} />
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
