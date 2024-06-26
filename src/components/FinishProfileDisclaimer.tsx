import { useTranslation } from "next-i18next";

const FinishProfileDisclaimer = (params: {
  userSocialMediaLength: number;
  portfolioLength: number;
}) => {
  const { t } = useTranslation();

  if (params.userSocialMediaLength === 0 && params.portfolioLength === 0) {
    return (
      <div className="flex h-auto items-center justify-center rounded-md bg-influencer p-4 text-center text-white">
        {t("components.finishProfileDisclaimer.disclaimer1")}
      </div>
    );
  } else if (params.userSocialMediaLength === 0 && params.portfolioLength > 0) {
    return (
      <div className="flex h-auto items-center justify-center rounded-md bg-influencer p-4 text-center text-white">
        {t("components.finishProfileDisclaimer.disclaimer2")}
      </div>
    );
  } else if (params.userSocialMediaLength > 0 && params.portfolioLength === 0) {
    return (
      <div className="flex h-auto items-center justify-center rounded-md bg-influencer p-4 text-center text-white">
        {t("components.finishProfileDisclaimer.disclaimer3")}
      </div>
    );
  }
};

export { FinishProfileDisclaimer };
