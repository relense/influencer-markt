import { Controller, useForm } from "react-hook-form";
import { type Option } from "../../../components/CustomMultiSelect/CustomMultiSelect";
import { Modal } from "../../../components/Modal/Modal";
import { CustomSelect } from "../../../components/CustomSelect/CustomSelect";

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
  return (
    <Modal title="Create a custom value pack request" onClose={params.onClose}>
      <form className="flex flex-col gap-4 overflow-y-auto p-8">
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
          <input
            {...register("requestSummary")}
            required
            type="text"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12"
            placeholder="E.g 1 Instagram Reel"
            autoComplete="off"
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Request Details</div>
          <textarea
            {...register("requestDetails")}
            required
            className="flex h-48 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12"
            placeholder="Specify your requirements for the chosen influencer. Share the desired number of posts or photos and the specific deliverables you expect. For example, if you need a TikTok video promoting our product, provide the necessary guidelines. Clear instructions help the influencer understand your expectations and engage your target audience effectively."
            autoComplete="off"
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Price</div>
          <input />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Delivery Date</div>
          <input />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">Your Social Media</div>
          <div>Let the influencer know you better</div>
          <input />
        </div>
      </form>
    </Modal>
  );
};

export { RequestCustomValuePackModal };
