import { Controller, useForm } from "react-hook-form";
import { type Option } from "../../../components/CustomMultiSelect";
import { Modal } from "../../../components/Modal";
import { CustomSelect } from "../../../components/CustomSelect";
import { Button } from "../../../components/Button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    <Modal
      title={t("components.requestValuePack.modalTitle")}
      onClose={params.onClose}
    >
      <form
        id="form-requestValuePack"
        className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={submitRequest}
      >
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.requestValuePack.platformsLabel")}
          </div>
          <Controller
            name="platform"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="platform"
                  placeholder={t(
                    "components.requestValuePack.platformPlaceHolder"
                  )}
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
          <div className="text-xl font-medium">
            {t("components.requestValuePack.summaryTitle")}
          </div>
          <div className="flex w-full flex-col">
            <input
              {...register("requestSummary", { maxLength: 50 })}
              required
              type="text"
              className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("components.requestValuePack.requestPlaceholder")}
              autoComplete="off"
            />
            {errors.requestSummary &&
              errors.requestSummary.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("components.requestValuePack.errorWarning", { count: 50 })}
                </div>
              )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.requestValuePack.detailsTitle")}
          </div>
          <div className="flex w-full flex-col">
            <textarea
              {...register("requestDetails", { maxLength: 200 })}
              required
              className="flex flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("components.requestValuePack.detailsPlaceholder")}
              autoComplete="off"
            />
            {errors.requestDetails &&
              errors.requestDetails.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("components.requestValuePack.errorWarning", {
                    count: 200,
                  })}
                </div>
              )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.requestValuePack.priceTitle")}
          </div>
          <input
            {...register("price")}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("components.requestValuePack.pricePlaceholder")}
            autoComplete="off"
            min="0"
            max="1000000000"
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("components.requestValuePack.deliveryTitle")}
          </div>
          <input
            {...register("deliveryDate")}
            required
            type="date"
            className="flex h-14 w-full flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12"
            placeholder={t("components.requestValuePack.deliveryPlaceholder")}
            autoComplete="off"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-medium">
              {t("components.requestValuePack.youSocialTitle")}
            </div>
            <div className="text-sm font-medium text-gray2">
              {t("components.requestValuePack.yourSocialSubTitle")}
            </div>
            <div className="flex w-full flex-col">
              <input
                {...register("website", { maxLength: 64 })}
                required
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                placeholder={t(
                  "components.requestValuePack.websitePlaceholder"
                )}
                autoComplete="off"
              />
              {errors.website && errors.website.type === "maxLength" && (
                <div className="px-4 py-1 text-red-600">
                  {t("components.requestValuePack.errorWarning", { count: 64 })}
                </div>
              )}
            </div>
            <div className="flex w-full flex-col">
              <input
                {...register("socialMediaLink", { maxLength: 64 })}
                required
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
                placeholder={t("components.requestValuePack.socialPlaceholder")}
                autoComplete="off"
              />
              {errors.socialMediaLink &&
                errors.socialMediaLink.type === "maxLength" && (
                  <div className="px-4 py-1 text-red-600">
                    {t("components.requestValuePack.errorWarning", {
                      count: 64,
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title={t("components.requestValuePack.modalButton")}
            level="primary"
            form="form-requestValuePack"
          />
        </div>
      </form>
    </Modal>
  );
};

export { RequestCustomValuePackModal };
