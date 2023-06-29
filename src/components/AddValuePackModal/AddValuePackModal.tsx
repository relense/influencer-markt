import {
  Controller,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { type SocialMedia } from "@prisma/client";
import { type ValuePack } from "../../pageComponents/FirstStepsPage/Views/Step4";

const AddValuePackModal = (params: {
  onCloseModal: () => void;
  onAddValuePack: () => void;
  register: UseFormRegister<ValuePack>;
  control: Control<ValuePack, any>;
  socialMedias: SocialMedia[] | undefined;
}) => {
  return (
    <Modal onClose={params.onCloseModal} title="Value Pack Builder">
      <form
        id="pack-form"
        onSubmit={params.onAddValuePack}
        className="flex h-full w-full flex-col items-center gap-4 p-4 sm:w-full sm:px-8"
      >
        <input
          {...params.register("title")}
          required
          type="text"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Value Pack Title: Provide a catchy and descriptive title for your offering"
          autoComplete="off"
        />
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
        <textarea
          {...params.register("description")}
          required
          className="box-border min-h-[10rem] w-full overflow-visible rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 sm:h-48 sm:min-h-[unset]"
          placeholder="Value Pack Description: Tell us about the unique offering in your package"
          autoComplete="off"
        />
        <input
          {...params.register("deliveryTime", { valueAsNumber: true })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Delivery Time E.g 4 days"
          autoComplete="off"
        />
        <input
          {...params.register("numberOfRevisions", { valueAsNumber: true })}
          required
          type="number"
          className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Number of Revisions E.g 1"
          autoComplete="off"
        />
        <input
          {...params.register("valuePackPrice", { valueAsNumber: true })}
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

export { AddValuePackModal };
