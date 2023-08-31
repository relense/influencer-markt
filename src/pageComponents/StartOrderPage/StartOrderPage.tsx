import { useTranslation } from "react-i18next";
import type { Option, ValuePack } from "../../utils/globalTypes";
import { useForm } from "react-hook-form";
import { helper } from "../../utils/helper";

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

  const renderInfluencerDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">Influencer Details</div>
        <div className="flex flex-1 gap-4">
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-influencer">Name</div>
            <div>BLABLA</div>
          </div>
        </div>
      </div>
    );
  };

  const renderOfferDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">Order Details</div>
        <div className="flex w-full flex-col">
          <textarea
            {...register("orderDetails", { maxLength: 2200 })}
            required
            className="flex h-48 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
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
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">Order Platform</div>
        <div className="font-semibold text-influencer">
          {params.valuePacks[0]?.platform.name}
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">Value Packs</div>
        <div className="flex flex-col gap-4 lg:flex-row">
          {params.valuePacks.map((valuePack) => {
            return (
              <div key={valuePack.id} className="flex items-center gap-4">
                <input
                  value={1}
                  type="number"
                  className="w-12 border-[1px] p-1 text-center"
                />
                <div className="flex w-40 gap-2">
                  <div className="text-base font-semibold text-influencer">
                    {t(`general.contentTypes.${valuePack.contentType.name}`)}
                  </div>
                  <div className="text-base font-medium">
                    {helper.formatNumberWithDecimalValue(
                      parseInt(valuePack.valuePackPrice)
                    )}
                    €
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-1 cursor-default flex-col gap-8 self-center px-8 py-8 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="text-4xl font-semibold">Initiate Order</div>
      {renderInfluencerDetails()}
      {renderPlatform()}
      {renderValuePacks()}
      {renderOfferDetails()}
    </div>
  );
};

export { StartOrderPage };
