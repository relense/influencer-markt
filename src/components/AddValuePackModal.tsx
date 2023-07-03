import {
  Controller,
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { CustomSelect } from "./CustomSelect";
import { type SocialMedia } from "@prisma/client";
import { type ValuePackType } from "../pageComponents/FirstStepsPage/Views/Step4";

const AddValuePackModal = (params: {
  onCloseModal: () => void;
  onAddValuePack: () => void;
  register: UseFormRegister<ValuePackType>;
  control: Control<ValuePackType, any>;
  errors: FieldErrors<ValuePackType>;
  socialMedias: SocialMedia[] | undefined;
}) => {
  return (
    <Modal onClose={params.onCloseModal} title="Value Pack Builder">
      <form
        id="pack-form"
        onSubmit={params.onAddValuePack}
        className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8"
      >
        <div className="flex w-full flex-col">
          <input
            {...params.register("title", { maxLength: 50 })}
            required
            type="text"
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Value Pack Title: Provide a catchy and descriptive title for your offering"
            autoComplete="off"
          />
          {params.errors.title && params.errors.title.type === "maxLength" && (
            <div className="px-4 py-1 text-red-600">Max is 50 characters</div>
          )}
        </div>
        <Controller
          name="platform"
          control={params.control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            return (
              <CustomSelect
                register={params.register}
                name="platform"
                placeholder="Select the social media platform for your value pack"
                options={params.socialMedias}
                handleOptionSelect={onChange}
                value={value}
              />
            );
          }}
        />
        <div className="flex w-full flex-col">
          <textarea
            {...params.register("description", { maxLength: 200 })}
            required
            className="box-border min-h-[10rem] w-full overflow-visible rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 sm:h-48 sm:min-h-[unset]"
            placeholder="Value Pack Description: Tell us about the unique offering in your package"
            autoComplete="off"
          />
          {params.errors.description &&
            params.errors.description.type === "maxLength" && (
              <div className="px-4 py-1 text-red-600">
                Max is 200 characters
              </div>
            )}
        </div>
        <input
          {...params.register("deliveryTime", {
            valueAsNumber: true,
          })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Delivery Time E.g 4 days"
          autoComplete="off"
          max="30"
        />
        <input
          {...params.register("numberOfRevisions", { valueAsNumber: true })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Number of Revisions E.g 1"
          autoComplete="off"
          max="3"
        />
        <input
          {...params.register("valuePackPrice", {
            valueAsNumber: true,
            maxLength: 10,
          })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Value Pack Price"
          autoComplete="off"
          max="1000000000"
        />
        <div className="flex w-full justify-center">
          <Button type="submit" title="Add Value Pack" level="primary" />
        </div>
      </form>
    </Modal>
  );
};

export { AddValuePackModal };
