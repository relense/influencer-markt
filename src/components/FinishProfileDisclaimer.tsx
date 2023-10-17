import { useTranslation } from "react-i18next";

const FinishProfileDisclaimer = (params: {
  userSocialMediaLength: number;
  portfolioLength: number;
}) => {
  const { t } = useTranslation();

  if (params.userSocialMediaLength === 0 && params.portfolioLength === 0) {
    return (
      <div className="flex h-10 items-center justify-center rounded-md bg-influencer p-8 text-center text-white">
        {t("components.finishProfileDisclaimer.disclaimer1")}
      </div>
    );
  } else if (params.userSocialMediaLength === 0 && params.portfolioLength > 0) {
    return (
      <div className="flex h-10 items-center justify-center rounded-md bg-influencer p-8 text-center text-white">
        {t("components.finishProfileDisclaimer.disclaimer2")}
      </div>
    );
  } else if (params.userSocialMediaLength > 0 && params.portfolioLength === 0) {
    return (
      <div className="flex h-10 items-center justify-center rounded-md bg-influencer p-8 text-center text-white">
        {t("components.finishProfileDisclaimer.disclaimer3")}
      </div>
    );
  }
};

export { FinishProfileDisclaimer };
