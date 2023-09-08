import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "~/utils/api";

import type { Option, ValuePack } from "../../utils/globalTypes";
import { helper } from "../../utils/helper";
import {
  faChevronDown,
  faChevronLeft,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button";
import Link from "next/link";

type OrderData = {
  orderDetails: string;
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
  const { t } = useTranslation();

  const [step, setStep] = useState<number>(0);
  const [stripeRef, setStripRef] = useState<string>("");
  const [orderId, setOrderId] = useState<number>(-1);

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

  const { data: profile } = api.profiles.getProfileById.useQuery({
    profileId: params.orderProfileId,
  });

  const { mutate: createOrder, isLoading } = api.orders.createOrder.useMutation(
    {
      onSuccess: (order) => {
        if (order) {
          setStep(1);
          setOrderId(order.id);
        }
      },
    }
  );

  const { mutate: updateOrder, isLoading: isLoadingUpdateOrder } =
    api.orders.updateOrder.useMutation();

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderData>();

  const handleAmountChange = (index: number, value: number) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, amount: value } : contentType
      )
    );
  };

  const handleAmountChangeArrows = (
    index: number,
    type: "increase" | "decrease"
  ) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index
          ? {
              ...contentType,
              amount:
                type === "increase"
                  ? contentType.amount++
                  : contentType.amount > 0
                  ? contentType.amount--
                  : 1,
            }
          : contentType
      )
    );
  };

  const submitOrder = handleSubmit((data) => {
    if (orderId === -1) {
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
      });
    } else {
      setStep(1);
    }
  });

  const savePaymentDetails = () => {
    setStep(2);
    updateOrder({
      orderId: orderId,
      statusId: 2,
    });

    createNotification({
      entityId: orderId,
      notificationType: "order",
      notificationTypeAction: "awaitingReply",
      notifierId: params.orderProfileId,
    });
  };

  const stepperTitleStep0 = () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="text-1xl flex h-10 w-10 items-center justify-center rounded-full border-[1px]">
            1
          </div>
          <div className="text-3xl">{t("pages.startOrder.initiateOrder")}</div>
        </div>
        <div
          className="hidden items-center gap-2 lg:flex"
          onClick={() => orderId !== -1 && setStep(1)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] text-base">
            2
          </div>
          <div className="text-lg">{t("pages.startOrder.paymentDetails")}</div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] text-base">
            3
          </div>
          <div className="text-lg">{t("pages.startOrder.summary")}</div>
        </div>
      </div>
    );
  };

  const stepperTitleStep1 = () => {
    return (
      <div className="flex items-center gap-4">
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="fa-lg cursor-pointer"
          onClick={() => setStep(0)}
        />
        <div
          className="hidden cursor-pointer items-center gap-2 lg:flex"
          onClick={() => setStep(0)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] text-base">
            1
          </div>
          <div className="text-lg">{t("pages.startOrder.initiateOrder")}</div>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-[1px] text-xl">
            2
          </div>
          <div className="text-3xl">{t("pages.startOrder.paymentDetails")}</div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] text-base">
            3
          </div>
          <div className="text-lg">{t("pages.startOrder.summary")}</div>
        </div>
      </div>
    );
  };

  const stepperTitleStep2 = () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="text-3xl">{t("pages.startOrder.summary")}</div>
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

  const renderOfferDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.startOrder.orderDetails")}
        </div>
        <div className="flex w-full flex-col">
          <textarea
            {...register("orderDetails", { maxLength: 2200 })}
            required
            className="flex h-48 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
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

  const renderFinalOfferDetails = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.startOrder.orderDetails")}
        </div>
        <div className="flex w-full flex-col whitespace-pre-line">
          {watch("orderDetails")}
        </div>
      </div>
    );
  };

  const renderPlatform = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">
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
        <div className="text-xl font-medium">
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

  const renderFinalValuePacks = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">
          {t("pages.startOrder.valuePacks")}
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          {contentTypesList.map((valuePack) => {
            return (
              <div
                key={valuePack.contentType.id}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-1">
                  {valuePack.amount}x
                </div>
                <div className="flex select-none gap-2">
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
          <div className="text-xl font-medium">
            {t("pages.startOrder.price")}
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.startOrder.valuePacks")}:
              </div>
              <div>{helper.formatNumberWithDecimalValue(valuePacksSum)}€</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.startOrder.fee")}:
              </div>
              <div>{helper.formatNumberWithDecimalValue(tax)}€</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                {t("pages.startOrder.total")}:
              </div>
              <div>{helper.formatNumberWithDecimalValue(total)}€</div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderPaymentDetails = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">
          {t("pages.startOrder.paymentDetails")}
        </div>
      </div>
    );
  };

  if (step === 0) {
    return (
      <div className="flex w-full flex-1 cursor-default flex-col gap-8 self-center px-8 py-8 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        {stepperTitleStep0()}
        {renderInfluencerDetails()}
        <div className="w-full border-[1px] border-white1" />
        {renderPlatform()}
        {renderValuePacks()}
        {renderTotalPay()}
        <div className="w-full border-[1px] border-white1" />
        <form id="form-order" onSubmit={submitOrder}>
          {renderOfferDetails()}
        </form>
        <div className="flex justify-center">
          <Button
            title={
              orderId !== -1
                ? t("pages.startOrder.continuePayments")
                : t("pages.startOrder.paymentDetails")
            }
            level="primary"
            size="regular"
            form="form-order"
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  } else if (step === 1) {
    return (
      <div className="flex w-full flex-1 cursor-default flex-col gap-8 self-center px-8 py-8 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        {stepperTitleStep1()}
        <input
          className="rounded-lg border-[1px]"
          type="text"
          value={stripeRef}
          onChange={(e) => setStripRef(e.target.value)}
        />
        <div className="flex justify-center">
          <Button
            title={t("pages.startOrder.summary")}
            level="primary"
            size="regular"
            onClick={() => savePaymentDetails()}
            isLoading={isLoadingUpdateOrder}
          />
        </div>
      </div>
    );
  } else if (step === 2) {
    return (
      <div className="flex w-full flex-1 cursor-default flex-col gap-8 self-center px-8 py-8 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        {stepperTitleStep2()}
        {renderPaymentDetails()}
        <div className="w-full border-[1px] border-white1" />
        {renderInfluencerDetails()}
        <div className="w-full border-[1px] border-white1" />
        {renderPlatform()}
        {renderFinalValuePacks()}
        {renderTotalPay()}
        <div className="w-full border-[1px] border-white1" />
        {renderFinalOfferDetails()}
        <Link href="/explore/influencers" className="flex justify-center">
          <Button
            title={t("pages.startOrder.exploreMore")}
            level="primary"
            size="regular"
          />
        </Link>
      </div>
    );
  }
};

export { StartOrderPage };
