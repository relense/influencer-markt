import { useTranslation } from "next-i18next";
const TermsConditionsPage = () => {
  const { t } = useTranslation();
  const renderAgreementTerms = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.agreementTerms.title")}
        </div>
        <div>{t("pages.termsConditions.agreementTerms.subtitle1")}</div>
        <div>{t("pages.termsConditions.agreementTerms.subtitle2")}</div>
        <div>{t("pages.termsConditions.agreementTerms.subtitle3")}</div>
        <div>{t("pages.termsConditions.agreementTerms.subtitle4")}</div>
      </div>
    );
  };

  const renderIntellectualProperyRight = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.intellectualPropertyRight.title")}
        </div>
        <div>
          {t("pages.termsConditions.intellectualPropertyRight.subtitle1")}
        </div>
        <div>
          {t("pages.termsConditions.intellectualPropertyRight.subtitle2")}
        </div>
      </div>
    );
  };

  const renderUserRepresentation = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.userRepresentation.title")}
        </div>
        <div>{t("pages.termsConditions.userRepresentation.subtitle1")}</div>
        <div className="flex flex-col gap-4 text-justify lg:text-left">
          <div>{t("pages.termsConditions.userRepresentation.subtitle2")}</div>
          <div>{t("pages.termsConditions.userRepresentation.subtitle3")}</div>
          <div>{t("pages.termsConditions.userRepresentation.subtitle4")}</div>
          <div>{t("pages.termsConditions.userRepresentation.subtitle5")}</div>
          <div>{t("pages.termsConditions.userRepresentation.subtitle6")}</div>
          <div>{t("pages.termsConditions.userRepresentation.subtitle7")} </div>
          <div>{t("pages.termsConditions.userRepresentation.subtitle8")}</div>
          <div>{t("pages.termsConditions.userRepresentation.subtitle9")}</div>
        </div>
        <div>{t("pages.termsConditions.userRepresentation.subtitle10")}</div>
        <div>{t("pages.termsConditions.userRepresentation.subtitle11")}</div>
      </div>
    );
  };

  const renderUserRegistration = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.userRegistration.title")}
        </div>
        <div>{t("pages.termsConditions.userRegistration.subtitle")}</div>
      </div>
    );
  };

  const renderMarketPlaceOfferings = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.marketPlaceOfferings.title")}
        </div>
        <div>{t("pages.termsConditions.marketPlaceOfferings.subtitle")}</div>
      </div>
    );
  };

  const renderPurchasesAndPayments = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.purchasesAndPayments.title")}
        </div>
        <div>{t("pages.termsConditions.purchasesAndPayments.subtitle1")}</div>
        <div>{t("pages.termsConditions.purchasesAndPayments.subtitle2")}</div>
        <div>{t("pages.termsConditions.purchasesAndPayments.subtitle3")}</div>
      </div>
    );
  };

  const renderPurchasesAndPayments2 = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.purchasesAndPayments2.title")}
        </div>
        <div>{t("pages.termsConditions.purchasesAndPayments2.subtitle1")}</div>
        <div>{t("pages.termsConditions.purchasesAndPayments2.subtitle2")}</div>
        <div>{t("pages.termsConditions.purchasesAndPayments2.subtitle3")}</div>
        <div>{t("pages.termsConditions.purchasesAndPayments2.subtitle4")}</div>
      </div>
    );
  };

  const renderRefundPolicy = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.refundPolicy.title")}
        </div>
        <div>{t("pages.termsConditions.refundPolicy.subtitle1")}</div>
        <div>{t("pages.termsConditions.refundPolicy.subtitle2")}</div>
        <div>{t("pages.termsConditions.refundPolicy.subtitle3")}</div>
      </div>
    );
  };

  const renderChargeBacks = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.chargebacks.title")}
        </div>
        <div>{t("pages.termsConditions.chargebacks.subtitle1")}</div>
        <div>{t("pages.termsConditions.chargebacks.subtitle2")}</div>
        <div>{t("pages.termsConditions.chargebacks.subtitle3")}</div>
        <div>{t("pages.termsConditions.chargebacks.subtitle4")}</div>
        <div>{t("pages.termsConditions.chargebacks.subtitle5")}</div>
        <div>{t("pages.termsConditions.chargebacks.subtitle6")}</div>
        <div>{t("pages.termsConditions.chargebacks.subtitle7")}</div>
      </div>
    );
  };

  const renderProhibitedActivities = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.prohibitedActivies.title")}
        </div>
        <div>{t("pages.termsConditions.prohibitedActivies.subtitle1")}</div>
        <div className="flex flex-col gap-4 text-justify lg:text-left">
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle2")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle3")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle4")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle5")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle6")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle7")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle8")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle9")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle10")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle11")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle12")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle13")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle14")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle15")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle16")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle17")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle18")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle19")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle20")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle21")}</div>
          <div>{t("pages.termsConditions.prohibitedActivies.subtitle22")}</div>
        </div>
      </div>
    );
  };

  const renderUserGeneratedContributions = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.userGeneratedContributions.title")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle1")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle2")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle3")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle4")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle5")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle6")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle7")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle8")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle9")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle10")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle11")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle12")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle13")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle14")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle15")}
        </div>
        <div>
          {t("pages.termsConditions.userGeneratedContributions.subtitle16")}
        </div>
      </div>
    );
  };

  const renderContributionLicense = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.contributingLicense.title")}
        </div>
        <div>{t("pages.termsConditions.contributingLicense.subtitle1")}</div>
        <div>{t("pages.termsConditions.contributingLicense.subtitle2")}</div>
        <div>{t("pages.termsConditions.contributingLicense.subtitle3")}</div>
        <div>{t("pages.termsConditions.contributingLicense.subtitle4")}</div>
      </div>
    );
  };

  const renderGuidelinesForReviews = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.guideLinesForReviews.title")}
        </div>
        <div>{t("pages.termsConditions.guideLinesForReviews.subtitle1")}</div>
        <div>{t("pages.termsConditions.guideLinesForReviews.subtitle2")}</div>
      </div>
    );
  };

  const renderMobileApplicationLicense = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.mobileApplicationsLicense.title")}
        </div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.mobileApplicationsLicense.subtitle1")}
        </div>
        <div>
          {t("pages.termsConditions.mobileApplicationsLicense.subtitle2")}
        </div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.mobileApplicationsLicense.subtitle3")}
        </div>
        <div>
          {t("pages.termsConditions.mobileApplicationsLicense.subtitle4")}
        </div>
      </div>
    );
  };

  const renderSocialMedia = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.socialMedia.title")}
        </div>
        <div>{t("pages.termsConditions.socialMedia.subtitle")}</div>
      </div>
    );
  };

  const renderSubmissions = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.submissions.title")}
        </div>
        <div>{t("pages.termsConditions.submissions.subtitle")}</div>
      </div>
    );
  };

  const renderThirPartyWebsitesAndContent = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.thirdPartyWebsitesAndcontent.title")}
        </div>
        <div>
          {t("pages.termsConditions.thirdPartyWebsitesAndcontent.subtitle")}
        </div>
      </div>
    );
  };

  const renderAdvertisers = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.advertisers.title")}
        </div>
        <div>{t("pages.termsConditions.advertisers.subtitle")}</div>
      </div>
    );
  };

  const renderSiteManagement = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.siteManagement.title")}
        </div>
        <div>{t("pages.termsConditions.siteManagement.subtitle")}</div>
      </div>
    );
  };

  const renderPrivacyPolicy = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.privacyPolicy.title")}
        </div>
        <div>{t("pages.termsConditions.privacyPolicy.subtitle")}</div>
      </div>
    );
  };

  const renderNoticeAndPolicy = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.noticePolicy.title")}
        </div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.noticePolicy.subtitle1")}
        </div>
        <div>{t("pages.termsConditions.noticePolicy.subtitle2")}</div>
        <div>{t("pages.termsConditions.noticePolicy.subtitle3")}</div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.noticePolicy.subtitle4")}
        </div>
        <div>{t("pages.termsConditions.noticePolicy.subtitle5")}</div>
        <div>{t("pages.termsConditions.noticePolicy.subtitle6")}</div>
        <div>{t("pages.termsConditions.noticePolicy.subtitle7")}</div>
        <div>{t("pages.termsConditions.noticePolicy.subtitle8")}</div>
        <div>{t("pages.termsConditions.noticePolicy.subtitle9")}</div>
      </div>
    );
  };

  const TermsAndTermination = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.termsAndTermination.title")}
        </div>
        <div>{t("pages.termsConditions.termsAndTermination.subtitle1")}</div>
        <div>{t("pages.termsConditions.termsAndTermination.subtitle2")}</div>
      </div>
    );
  };

  const renderModificationsAndInterruptions = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.modificationsAndInterruptions.title")}
        </div>
        <div>
          {t("pages.termsConditions.modificationsAndInterruptions.subtitle1")}
        </div>
        <div>
          {t("pages.termsConditions.modificationsAndInterruptions.subtitle2")}
        </div>
      </div>
    );
  };

  const renderGoverningLaw = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.governingLaw.title")}
        </div>
        <div>{t("pages.termsConditions.governingLaw.subtitle")}</div>
      </div>
    );
  };

  const renderDisputeResolution = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.disputeResolution.title")}
        </div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.disputeResolution.subtitle1")}
        </div>
        <div>{t("pages.termsConditions.disputeResolution.subtitle2")}</div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.disputeResolution.subtitle3")}
        </div>
        <div>{t("pages.termsConditions.disputeResolution.subtitle4")}</div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.disputeResolution.subtitle5")}
        </div>
        <div>{t("pages.termsConditions.disputeResolution.subtitle6")}</div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.disputeResolution.subtitle7")}
        </div>
        <div>{t("pages.termsConditions.disputeResolution.subtitle8")}</div>
      </div>
    );
  };

  const renderDisclaimer = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.disclaimer.title")}
        </div>
        <div>{t("pages.termsConditions.disclaimer.subtitle")}</div>
      </div>
    );
  };

  const renderLimitationsOfLiability = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.limitationsLiability.title")}
        </div>
        <div>{t("pages.termsConditions.limitationsLiability.subtitle")}</div>
      </div>
    );
  };

  const renderIndemnification = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.indemnification.title")}
        </div>
        <div>{t("pages.termsConditions.indemnification.subtitle")}</div>
      </div>
    );
  };

  const renderUserData = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.userData.title")}
        </div>
        <div>{t("pages.termsConditions.userData.subtitle")}</div>
      </div>
    );
  };

  const renderElectronicCommunicationsTransactionsAndSignatures = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t(
            "pages.termsConditions.electronicCommunicationsTransactionsAndSignatures.title"
          )}
        </div>
        <div>
          {t(
            "pages.termsConditions.electronicCommunicationsTransactionsAndSignatures.subtitle"
          )}
        </div>
      </div>
    );
  };

  const renderMiscellaneous = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.miscellaneous.title")}
        </div>
        <div>{t("pages.termsConditions.miscellaneous.subtitle1")}</div>
        <div className="text-lg font-semibold">
          {t("pages.termsConditions.miscellaneous.subtitle2")}
        </div>
        <div>{t("pages.termsConditions.miscellaneous.subtitle3")}</div>
        <div>{t("pages.termsConditions.miscellaneous.subtitle4")}</div>
        <div>{t("pages.termsConditions.miscellaneous.subtitle5")}</div>
        <div>{t("pages.termsConditions.miscellaneous.subtitle6")}</div>
      </div>
    );
  };

  const renderContactUs = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.termsConditions.contactUs.title")}
        </div>
        <div>{t("pages.termsConditions.contactUs.subtitle1")}</div>
        <div>{t("pages.termsConditions.contactUs.subtitle2")}</div>
        <div>{t("pages.termsConditions.contactUs.subtitle3")}</div>
        <div>{t("pages.termsConditions.contactUs.subtitle4")}</div>
        <div>{t("pages.termsConditions.contactUs.subtitle5")}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-4 xl:w-3/4 xl:self-center 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="text-center font-playfair text-4xl font-semibold">
        {t("pages.termsConditions.title")}
      </div>
      <div className="text-center font-playfair text-4xl font-semibold">
        {t("pages.termsConditions.date")}
      </div>
      {renderAgreementTerms()}
      {renderIntellectualProperyRight()}
      {renderUserRepresentation()}
      {renderUserRegistration()}
      {renderMarketPlaceOfferings()}
      {renderPurchasesAndPayments()}
      {renderPurchasesAndPayments2()}
      {renderRefundPolicy()}
      {renderChargeBacks()}
      {renderProhibitedActivities()}
      {renderUserGeneratedContributions()}
      {renderContributionLicense()}
      {renderGuidelinesForReviews()}
      {renderMobileApplicationLicense()}
      {renderSocialMedia()}
      {renderSubmissions()}
      {renderThirPartyWebsitesAndContent()}
      {renderAdvertisers()}
      {renderSiteManagement()}
      {renderPrivacyPolicy()}
      {renderNoticeAndPolicy()}
      {TermsAndTermination()}
      {renderModificationsAndInterruptions()}
      {renderGoverningLaw()}
      {renderDisputeResolution()}
      {renderDisclaimer()}
      {renderLimitationsOfLiability()}
      {renderIndemnification()}
      {renderUserData()}
      {renderElectronicCommunicationsTransactionsAndSignatures()}
      {renderMiscellaneous()}
      {renderContactUs()}
    </div>
  );
};

export { TermsConditionsPage };
