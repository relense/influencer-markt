import { useTranslation } from "react-i18next";
import type { Option, ValuePack } from "../../utils/globalTypes";
import { Controller, useForm } from "react-hook-form";
import { CustomSelect } from "../../components/CustomSelect";

type OrderData = {
  orderDetails: string;
  orderPrice: string;
  orderPlatform: Option;
  orderValuePacks: ContentTypeWithQuantity[];
};

type ContentTypeWithQuantity = {
  contentType: Option;
  amount: number;
};

const StartOrderPage = (params: {
  valuePacks: ValuePack[];
  orderProfileId: string;
}) => {
  const { t } = useTranslation();

  const valuePacksSum = () => {
    let totalSum = 0;

    params.valuePacks.forEach((valuePack) => {
      totalSum += parseFloat(valuePack.valuePackPrice);
    });

    return totalSum;
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<OrderData>({
    defaultValues: {
      orderPlatform: params.valuePacks[0]?.platform,
      orderPrice: "",
      orderValuePacks: params.valuePacks.map((valuePack) => {
        return {
          contentType: valuePack.contentType,
          amount: parseFloat(valuePack.valuePackPrice),
        };
      }),
    },
  });

  const renderOfferDetails = () => {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.manageOffers.offerDetails")}
        </div>
        <div className="flex w-full flex-1 flex-col">
          <textarea
            {...register("orderDetails", { maxLength: 2200 })}
            required
            className="flex h-full cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.manageOffers.detailsPlaceholder")}
            autoComplete="off"
          />
          {errors.orderDetails && errors.orderDetails.type === "maxLength" && (
            <div className="px-4 py-1 text-red-600">
              {t("pages.manageOffers..errorWarning", {
                count: 2200,
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPlatform = () => {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.manageOffers.platformTitle")}
        </div>
        <div>{params.valuePacks[0]?.platform.name}</div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-1 cursor-default flex-col gap-8 self-center px-2 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="text-4xl font-semibold">Initiate Order</div>
      {renderOfferDetails()}
      {renderPlatform()}
    </div>
  );
};

export { StartOrderPage };
