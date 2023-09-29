import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "~/utils/api";

import type { Option, ValuePack } from "../../utils/globalTypes";
import { helper } from "../../utils/helper";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button";
import { useRouter } from "next/router";
import dayjs from "dayjs";

type OrderData = {
  orderDetails: string;
  dateOfDelivery: Date;
};

type ContentTypeWithQuantityAndValue = {
  contentType: Option;
  amount: number;
  price: number;
  platform: Option;
};

const StartOrderPage = (params: {
  valuePacks: ValuePack[];
  orderProfileId: number;
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [contentTypesList, setContentTypesList] = useState<
    ContentTypeWithQuantityAndValue[]
  >(
    params.valuePacks.map((valuePack) => {
      return {
        platform: valuePack.platform,
        contentType: valuePack.contentType,
        amount: 1,
        price: parseFloat(valuePack.valuePackPrice),
      };
    })
  );
  const [disableSubmitButton, setDisableSubmitButton] =
    useState<boolean>(false);

  const { data: profile } = api.profiles.getProfileById.useQuery({
    profileId: params.orderProfileId,
  });

  const { mutate: createOrder, isLoading } = api.orders.createOrder.useMutation(
    {
      onSuccess: (order) => {
        if (order) {
          void router.push({
            pathname: `/orders/${order.id}`,
            query: {
              redirect: true,
            },
          });

          createNotification({
            entityId: order.id,
            notificationTypeAction: "awaitingReply",
            notifierId: params.orderProfileId,
          });
        }
      },
    }
  );

  const { mutate: createNotification } =
    api.notifications.createSalesNotification.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderData>();

  const handleAmountChange = (index: number, value: number) => {
    let newValue = 0;
    if (value >= 1 && value <= 10) {
      newValue = value;
    } else {
      newValue = 1;
    }

    setContentTypesList((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, amount: newValue } : contentType
      )
    );
  };

  const handleAmountChangeArrows = (
    index: number,
    type: "increase" | "decrease"
  ) => {
    const updatedContentTypesList = contentTypesList.map((contentType, i) => {
      if (i === index) {
        let newAmount = contentType.amount;

        if (type === "increase") {
          if (contentType.amount + 1 > 10) {
            newAmount = 10;
          } else {
            newAmount = contentType.amount + 1;
          }
        } else if (type === "decrease") {
          if (contentType.amount - 1 < 1) {
            newAmount = 1;
          } else {
            newAmount = contentType.amount - 1;
          }
        }

        return {
          ...contentType,
          amount: newAmount,
        };
      } else {
        return contentType;
      }
    });

    setContentTypesList(updatedContentTypesList);
  };

  const submitOrder = handleSubmit((data) => {
    setDisableSubmitButton(true);
    let valuePacksSum = 0;

    contentTypesList.forEach((contentType) => {
      valuePacksSum += contentType.amount * contentType.price;
    });

    const tax = valuePacksSum * ((profile?.country?.countryTax || 0) / 100);
    const total = valuePacksSum + tax;

    createOrder({
      influencerId: params.orderProfileId,
      orderDetails: data.orderDetails,
      orderPrice: total.toString(),
      orderValuePacks: contentTypesList.map((valuePack) => {
        return {
          amount: valuePack.amount,
          price: valuePack.price.toString(),
          contentTypeId: valuePack.contentType.id,
        };
      }),
      platformId: params.valuePacks[0]?.platform?.id || -1,
      language: i18n.language,
      dateOfDelivery: dayjs(data.dateOfDelivery).toDate(),
    });
  });

  const stepperTitle = () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="text-3xl">{t("pages.startOrder.initiateOrder")}</div>
        </div>
      </div>
    );
  };

  const renderInfluencerDetails = () => {
    if (profile) {
      return (
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.startOrder.influencerDetails")}
          </div>
          <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-12">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.startOrder.name")}
              </div>
              <div>{profile?.name}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.startOrder.gender")}
              </div>
              <div>
                {t(`components.profileForm.${profile?.gender?.name || ""}`)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.startOrder.location")}
              </div>
              <div>
                {profile?.country?.name || ""}, {profile?.city?.name || ""}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderJobDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.startOrder.orderDetails")}
        </div>
        <div className="flex w-full flex-col">
          <textarea
            {...register("orderDetails", { maxLength: 2200 })}
            required
            className="flex h-48 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12  focus:border-[1px] focus:border-black focus:outline-none"
            placeholder={t("pages.startOrder.detailsPlaceholder")}
            autoComplete="off"
          />
          {errors.orderDetails && errors.orderDetails.type === "maxLength" && (
            <div className="px-4 py-1 text-red-600">
              {t("pages.startOrder.errorWarning", {
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
        <div className="select-none text-xl font-medium">
          {t("pages.startOrder.orderPlatform")}
        </div>
        <div className="font-semibold text-influencer">
          {params.valuePacks[0]?.platform.name}
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="select-none text-xl font-medium">
          {t("pages.startOrder.valuePacks")}
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          {contentTypesList.map((valuePack, index) => {
            return (
              <div
                key={valuePack.contentType.id}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-1">
                  <input
                    value={valuePack.amount}
                    type="number"
                    max={10}
                    min={1}
                    className="w-12 rounded-lg border-[1px] p-1 text-center"
                    onChange={(e) =>
                      handleAmountChange(index, parseInt(e.target.value))
                    }
                  />
                  <div className="flex flex-col">
                    <FontAwesomeIcon
                      icon={faChevronUp}
                      className="fa-sm cursor-pointer"
                      onClick={() =>
                        handleAmountChangeArrows(index, "increase")
                      }
                    />
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="fa-sm cursor-pointer"
                      onClick={() =>
                        handleAmountChangeArrows(index, "decrease")
                      }
                    />
                  </div>
                </div>
                <div className="flex w-40 select-none gap-2">
                  <div className="text-base font-semibold text-influencer">
                    {t(`general.contentTypes.${valuePack.contentType.name}`)}
                  </div>
                  <div className="text-base font-medium">
                    {helper.formatNumberWithDecimalValue(
                      valuePack.price * valuePack.amount
                    ) || 0}
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

  const renderTotalPay = () => {
    if (profile) {
      let valuePacksSum = 0;

      contentTypesList.forEach((contentType) => {
        valuePacksSum += contentType.amount * contentType.price;
      });

      const tax = valuePacksSum * ((profile?.country?.countryTax || 0) / 100);
      const total = valuePacksSum + tax;

      return (
        <div className="flex flex-col gap-2">
          <div className="select-none text-xl font-medium">
            {t("pages.startOrder.price")}
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2">
              <div className="select-none font-semibold text-influencer">
                {t("pages.startOrder.valuePacks")}:
              </div>
              <div>{helper.formatNumberWithDecimalValue(valuePacksSum)}€</div>
            </div>
            <div className="flex gap-2">
              <div className="select-none font-semibold text-influencer">
                {t("pages.startOrder.fee")}:
              </div>
              <div>{helper.formatNumberWithDecimalValue(tax)}€</div>
            </div>
            <div className="flex gap-2">
              <div className="select-none font-semibold text-influencer">
                {t("pages.startOrder.total")}:
              </div>
              <div>{helper.formatNumberWithDecimalValue(total)}€</div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderDeliveryDate = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="select-none text-xl font-medium">
          {t("pages.startOrder.dateDelivery")}
        </div>
        <div>
          <input
            {...register("dateOfDelivery")}
            type="date"
            required
            className="rounded-xl border-[1px] p-2 focus:border-[1px] focus:border-black focus:outline-none"
            min={dayjs(Date.now()).format("YYYY-MM-DD")}
          />
        </div>
        <span className="pl-2 text-sm text-gray2">
          {t("pages.startOrder.dateDisclaimer")}
        </span>
      </div>
    );
  };

  return (
    <form
      id="form-order"
      onSubmit={submitOrder}
      className="flex w-full flex-1 cursor-default flex-col gap-8 self-center px-8 py-8 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4"
    >
      {stepperTitle()}
      {renderInfluencerDetails()}
      <div className="w-full border-[1px] border-white1" />
      {renderPlatform()}
      {renderValuePacks()}
      {renderTotalPay()}
      {renderDeliveryDate()}
      <div className="w-full border-[1px] border-white1" />

      {renderJobDetails()}
      <div className="flex justify-center">
        <Button
          title={t("pages.startOrder.orderSummary")}
          level="primary"
          size="regular"
          form="form-order"
          isLoading={isLoading}
          disabled={disableSubmitButton}
        />
      </div>
    </form>
  );
};

export { StartOrderPage };
