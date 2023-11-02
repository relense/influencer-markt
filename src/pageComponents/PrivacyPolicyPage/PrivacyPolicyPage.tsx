import { useTranslation } from "react-i18next";

const PrivacyPolicyPage = () => {
  const { t } = useTranslation();

  const renderIntroduction = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.introduction.title")}
        </div>
        <div>{t("pages.privacyPolicy.introduction.subtitle")}</div>
      </div>
    );
  };

  const renderPurposesOfProcessing = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.purposeOfProcessing.title1")}
        </div>
        <div className="text-lg font-semibold">
          {t("pages.privacyPolicy.purposeOfProcessing.title2")}
        </div>
        <div>{t("pages.privacyPolicy.purposeOfProcessing.subtitle2")}</div>
        <div className="text-lg font-semibold">
          {t("pages.privacyPolicy.purposeOfProcessing.title3")}
        </div>
        <div>{t("pages.privacyPolicy.purposeOfProcessing.subtitle3")}</div>
      </div>
    );
  };

  const renderCollectionYourPersonalData = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.collectionYourPersonalData.title1")}
        </div>
        <div className="text-lg font-semibold">
          {t("pages.privacyPolicy.collectionYourPersonalData.title2")}
        </div>
        <div>
          {t("pages.privacyPolicy.collectionYourPersonalData.subtitle2")}
        </div>
        <div>
          {t("pages.privacyPolicy.collectionYourPersonalData.subtitle3")}
        </div>
        <div>
          {t("pages.privacyPolicy.collectionYourPersonalData.subtitle4")}
        </div>
        <div>
          {t("pages.privacyPolicy.collectionYourPersonalData.subtitle5")}
        </div>
        <div>
          {t("pages.privacyPolicy.collectionYourPersonalData.subtitle6")}
        </div>
      </div>
    );
  };

  const renderCookies = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.cookies.title1")}
        </div>
        <div className="text-lg font-semibold">
          {t("pages.privacyPolicy.cookies.title2")}
        </div>
        <div>{t("pages.privacyPolicy.cookies.subtitle2")}</div>
        <div className="text-lg font-semibold">
          {t("pages.privacyPolicy.cookies.title3")}
        </div>
        <div>{t("pages.privacyPolicy.cookies.subtitle3")}</div>
        <div>{t("pages.privacyPolicy.cookies.subtitle4")}</div>
        <div>{t("pages.privacyPolicy.cookies.subtitle5")}</div>
        <div>{t("pages.privacyPolicy.cookies.subtitle6")}</div>
        <div>{t("pages.privacyPolicy.cookies.subtitle7")}</div>
        <div>{t("pages.privacyPolicy.cookies.subtitle8")}</div>
      </div>
    );
  };

  const renderManagingCookies = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.managingCookies.title")}
        </div>
        <div>{t("pages.privacyPolicy.managingCookies.subtitle1")}</div>
        <div>{t("pages.privacyPolicy.managingCookies.subtitle2")}</div>
        <div>{t("pages.privacyPolicy.managingCookies.subtitle3")}</div>
      </div>
    );
  };

  const renderSecurityMeasures = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.securityMeasures.title")}
        </div>
        <div>{t("pages.privacyPolicy.securityMeasures.subtitle")}</div>
      </div>
    );
  };

  const renderDataRetention = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.dataRetention.title")}
        </div>
        <div>{t("pages.privacyPolicy.dataRetention.subtitle")}</div>
      </div>
    );
  };

  const renderOurPolicyOnChildren = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.policyOnChildren.title")}
        </div>
        <div>{t("pages.privacyPolicy.policyOnChildren.subtitle")}</div>
      </div>
    );
  };

  const renderYourRights = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div className="text-center text-2xl font-semibold lg:text-left">
          {t("pages.privacyPolicy.yourRight.title1")}
        </div>
        <div>{t("pages.privacyPolicy.yourRight.subtitle1")}</div>
        <div>
          <strong>{t("pages.privacyPolicy.yourRight.subtitle2")}</strong>{" "}
          {t("pages.privacyPolicy.yourRight.subtitle2")}
        </div>
        <div>
          <strong>{t("pages.privacyPolicy.yourRight.title3")}</strong>{" "}
          {t("pages.privacyPolicy.yourRight.subtitle3")}
        </div>
        <div>
          <strong>{t("pages.privacyPolicy.yourRight.title4")}</strong>{" "}
          {t("pages.privacyPolicy.yourRight.subtitle4")}
        </div>
        <div>
          <strong>{t("pages.privacyPolicy.yourRight.title5")}</strong>{" "}
          {t("pages.privacyPolicy.yourRight.subtitle5")}
        </div>
        <div>
          <strong>{t("pages.privacyPolicy.yourRight.title6")}</strong>{" "}
          {t("pages.privacyPolicy.yourRight.subtitle6")}
        </div>
        <div>
          <strong>{t("pages.privacyPolicy.yourRight.title7")}</strong>{" "}
          {t("pages.privacyPolicy.yourRight.subtitle7")}
        </div>
        <div>
          <strong>{t("pages.privacyPolicy.yourRight.title8")}</strong>{" "}
          {t("pages.privacyPolicy.yourRight.subtitle8")}
        </div>
        <div>{t("pages.privacyPolicy.yourRight.subtitle9")}</div>
      </div>
    );
  };

  const renderFinal = () => {
    return (
      <div className="flex flex-col gap-4 text-justify lg:text-left">
        <div>{t("pages.privacyPolicy.final.subtitle")}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-4 xl:w-3/4 xl:self-center 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="text-center font-playfair text-4xl font-semibold">
        {t("pages.privacyPolicy.title")}
      </div>
      <div className="text-center font-playfair text-4xl font-semibold">
        {t("pages.privacyPolicy.date")}
      </div>
      {renderIntroduction()}
      {renderPurposesOfProcessing()}
      {renderCollectionYourPersonalData()}
      {renderCookies()}
      {renderManagingCookies()}
      {renderSecurityMeasures()}
      {renderDataRetention()}
      {renderOurPolicyOnChildren()}
      {renderYourRights()}
      {renderFinal()}
    </div>
  );
};

export { PrivacyPolicyPage };
