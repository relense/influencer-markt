import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import type {
  Option,
  SocialMediaDetails,
  ValuePack,
} from "../../../utils/globalTypes";
import { api } from "~/utils/api";
import { CustomSelect } from "../../../components/CustomSelect";
import { helper } from "../../../utils/helper";
import { Button } from "../../../components/Button";

const ValuePackChooser = (params: {
  availableUserSocialMedia: SocialMediaDetails[];
  platform: Option;
  onChangePlatform: (option: Option) => void;
  selectedValuePacks: ValuePack[];
  onSelecteValuePack: (valuePack: ValuePack) => void;
  profileId: number;
  loggedInProfileId: number;
  openLoginModal: () => void;
  profileCountryTax: number;
}) => {
  const { status } = useSession();
  const { t } = useTranslation();

  const selectedUserSocialMedia: SocialMediaDetails | undefined =
    params.availableUserSocialMedia.find((userSocialMedia) => {
      return userSocialMedia.platform.id === params.platform.id;
    });

  const { data: ratingsInfo } = api.reviews.getAverageReviewsRating.useQuery({
    profileId: params.profileId,
  });

  const sumValuePacks = () => {
    let totalSum = 0;

    params.selectedValuePacks.forEach((valuePack) => {
      totalSum += valuePack.valuePackPrice;
    });

    return totalSum;
  };

  const renderAverageRating = () => {
    if (ratingsInfo && ratingsInfo[1] && ratingsInfo[1] > 0) {
      return (
        <div className="flex flex-1 flex-col items-end justify-end gap-2 xs:flex-row xs:items-center">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon
              icon={faStar}
              className="fa-lg cursor-pointer pb-1"
            />
            <div>{ratingsInfo[0]}</div>
          </div>
          <div className="hidden h-2 w-2 rounded-full bg-black xs:block" />
          <div className="text-gray2">
            {t("pages.publicProfilePage.reviews", {
              count: ratingsInfo[1],
            })}
          </div>
        </div>
      );
    }
  };

  const renderPlatformChooser = () => {
    return (
      <div className="rounded-2xl border-[1px] border-white1">
        <div className="flex flex-col pt-4">
          <div className="px-4 text-sm font-semibold">
            {t("pages.publicProfilePage.platform")}
          </div>

          <CustomSelect
            name={`platform`}
            noBorder
            placeholder={t("pages.publicProfilePage.platformPlaceholder")}
            options={params.availableUserSocialMedia.map((userSocialMedia) => {
              return {
                id: userSocialMedia.platform.id,
                name: userSocialMedia.platform.name,
              };
            })}
            handleOptionSelect={params.onChangePlatform}
            value={params.platform}
          />
        </div>
        {params.platform.id !== -1 && (
          <>
            <div className="w-full border-[1px] border-white1" />
            <div className="flex flex-wrap justify-start gap-2 p-2">
              {selectedUserSocialMedia &&
                selectedUserSocialMedia.valuePacks.map((valuePack) => {
                  let selectedContainer = "text-black";

                  if (params.selectedValuePacks.length > 0) {
                    for (const selected of params.selectedValuePacks) {
                      if (selected.id === valuePack.id) {
                        selectedContainer = "bg-influencer-green text-white";
                        break;
                      }
                    }
                  }

                  const containerClass = `group flex w-full lg:flex-[0_1_49%] cursor-pointer flex-col items-start gap-2 rounded-lg border p-2 text-sm font-medium hover:bg-influencer-green ${selectedContainer}`;

                  return (
                    <div
                      key={valuePack.id}
                      className={containerClass}
                      onClick={() => params.onSelecteValuePack(valuePack)}
                    >
                      <div className="flex w-full flex-1 justify-between ">
                        <div className="text-base font-medium ">
                          {t(
                            `general.contentTypes.${valuePack.contentType.name}`
                          )}
                        </div>
                        <div className="text-base font-medium ">
                          {helper.formatNumber(
                            helper.calculerMonetaryValue(
                              valuePack.valuePackPrice
                            )
                          )}
                          €
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderInitiateRequestButton = () => {
    if (status === "authenticated") {
      return (
        <Link
          href={{
            pathname: "/start-order",
            query: {
              valuePacks: JSON.stringify(params.selectedValuePacks),
              profileId: JSON.stringify(params.profileId || ""),
            },
          }}
        >
          <Button
            title={t("pages.publicProfilePage.valuePackSubmitButton")}
            level="primary"
            size="large"
            disabled={
              params.platform.id === -1 ||
              params.selectedValuePacks.length === 0 ||
              params.loggedInProfileId === params.profileId
            }
          />
        </Link>
      );
    } else {
      return (
        <Button
          title={t("pages.publicProfilePage.valuePackSubmitButton")}
          level="primary"
          size="large"
          disabled={
            params.platform.id === -1 || params.selectedValuePacks.length === 0
          }
          onClick={() => params.openLoginModal()}
        />
      );
    }
  };

  const renderTotalsSection = () => {
    const valuePacksTotalInCents = sumValuePacks();

    const sumTotal = helper.calculerMonetaryValue(valuePacksTotalInCents);

    const serviceTaxTotal = helper.calculerMonetaryValue(
      valuePacksTotalInCents * helper.calculateServiceFee()
    );

    const calculateTaxesTotal = helper.calculerMonetaryValue(
      valuePacksTotalInCents * (params.profileCountryTax / 100)
    );

    const calculateOrderTotal = helper.formatNumber(
      Number((sumTotal + serviceTaxTotal + calculateTaxesTotal).toFixed(2))
    );

    return (
      <div className="flex flex-col gap-4 text-lg">
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 justify-between">
            <div>{t("pages.publicProfilePage.subtotal")}</div>
            {params.selectedValuePacks.length > 0 ? (
              <div>{helper.formatNumber(sumTotal)}€</div>
            ) : (
              "-"
            )}
          </div>
          <div className="flex flex-1 justify-between">
            <div>{t("pages.publicProfilePage.serviceFee")}</div>
            {params.selectedValuePacks.length > 0 &&
            params.profileCountryTax ? (
              <div>{helper.formatNumber(serviceTaxTotal)}€</div>
            ) : (
              "-"
            )}
          </div>
          <div className="flex flex-1 justify-between">
            <div>{t("pages.publicProfilePage.fee")}</div>
            {params.selectedValuePacks.length > 0 &&
            params.profileCountryTax ? (
              <div>{helper.formatNumber(calculateTaxesTotal)}€</div>
            ) : (
              "-"
            )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
        <div className="flex flex-1 justify-between font-semibold">
          <div>{t("pages.publicProfilePage.total")}</div>
          {params.selectedValuePacks.length > 0 && valuePacksTotalInCents ? (
            <div>{calculateOrderTotal}€</div>
          ) : (
            "-"
          )}
        </div>
      </div>
    );
  };

  const renderDisclaimer = () => {
    return (
      <div className="flex items-center justify-center gap-2 text-center text-gray2">
        <div>{t("pages.publicProfilePage.disclaimer")}</div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-white1 p-4 shadow-xl">
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-1">
            {params.selectedValuePacks.length > 0 && (
              <div className="text-xl font-medium">
                {helper.formatNumber(
                  helper.calculerMonetaryValue(sumValuePacks())
                )}
                €
              </div>
            )}
          </div>
          {renderAverageRating()}
        </div>

        {renderPlatformChooser()}
        {renderInitiateRequestButton()}
        {renderDisclaimer()}
        {renderTotalsSection()}
      </div>
    </>
  );
};

export { ValuePackChooser };
