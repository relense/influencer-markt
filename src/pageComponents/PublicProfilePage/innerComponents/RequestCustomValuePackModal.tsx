import { Controller, useForm } from "react-hook-form";
import { type Option } from "../../../components/CustomMultiSelect";
import { Modal } from "../../../components/Modal";
import { CustomSelect } from "../../../components/CustomSelect";
import { Button } from "../../../components/Button";

type CustomValuePackData = {
  platform: Option;
  requestSummary: string;
  requestDetails: string;
  price: number;
  deliveryDate: Date;
  website: string;
  socialMediaLink: string;
};

const RequestCustomValuePackModal = (params: {
  onClose: () => void;
  availablePlatforms: Option[];
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomValuePackData>({
    defaultValues: {
      platform: { id: -1, name: "" },
    },
  });

  const submitRequest = handleSubmit((data) => {
    console.log(JSON.stringify(data));
  });
  return (
    <Modal title="Request a custom value pack" onClose={params.onClose}>
      <form
        id="form-requestValuePack"
        className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={submitRequest}
      >
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Platforms</div>
          <Controller
            name="platform"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="platform"
                  placeholder="Choose your Social Media: e.g., Instagram, TikTok"
                  options={params.availablePlatforms}
                  value={value}
                  handleOptionSelect={onChange}
                />
              );
            }}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Request Summary</div>
          <div className="flex w-full flex-col">
            <input
              {...register("requestSummary", { maxLength: 50 })}
              required
              type="text"
              className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder="E.g 1 Instagram Reel"
              autoComplete="off"
            />
            {errors.requestSummary &&
              errors.requestSummary.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  Max is 50 characters
                </div>
              )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Request Details</div>
          <div className="flex w-full flex-col">
            <textarea
              {...register("requestDetails", { maxLength: 200 })}
              required
              className="flex flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder="Specify your requirements for the chosen influencer. Share the desired number of posts or photos and the specific deliverables you expect. For example, if you need a TikTok video promoting our product, provide the necessary guidelines. Clear instructions help the influencer understand your expectations and engage your target audience effectively."
              autoComplete="off"
            />
            {errors.requestDetails &&
              errors.requestDetails.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  Max is 200 characters
                </div>
              )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Price</div>
          <input
            {...register("price")}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder="Value pack price"
            autoComplete="off"
            min="0"
            max="1000000000"
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Delivery Date</div>
          <input
            {...register("deliveryDate")}
            required
            type="date"
            className="flex h-14 w-full flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12"
            placeholder="Choose a delivery date"
            autoComplete="off"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-medium">Your Social Media</div>
            <div className="text-sm font-medium text-gray2">
              Let the influencer know you better
            </div>
            <div className="flex w-full flex-col">
              <input
                {...register("website", { maxLength: 64 })}
                required
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                placeholder="Your website"
                autoComplete="off"
              />
              {errors.website && errors.website.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  Max is 64 characters
                </div>
              )}
            </div>
            <div className="flex w-full flex-col">
              <input
                {...register("socialMediaLink", { maxLength: 64 })}
                required
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                placeholder="Main social media account E.g. https://www.instagram.com/account"
                autoComplete="off"
              />
              {errors.socialMediaLink &&
                errors.socialMediaLink.type === "maxLength" && (
                  <div className="px-4 py-1 text-red-600">
                    Max is 64 characters
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title="Add Value Pack"
            level="primary"
            form="form-requestValuePack"
          />
        </div>
      </form>
    </Modal>
  );
};

export { RequestCustomValuePackModal };
