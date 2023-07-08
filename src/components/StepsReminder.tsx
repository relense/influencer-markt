import { useTranslation } from "react-i18next";

export const StepsReminder = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4 text-center text-sm">
      <span>{t("components.stepsReminder.reminder")}</span>{" "}
      <span className="font-extrabold">
        {t("components.stepsReminder.dashboard")}
      </span>
    </div>
  );
};
