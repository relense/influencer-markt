import { Button } from "../../../components/Button";
import { useTranslation } from "react-i18next";

export const FinalStep = (params: {
  changeStep: (value: "next" | "previous") => void;
  saveAllData: () => void;
  isLoadingSavingData: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center gap-8">
      <form id="form-hook" onSubmit={() => params.changeStep("next")} />
      <Button
        title={t("pages.firstSteps.finalStep.button")}
        level="primary"
        size="large"
        onClick={() => params.saveAllData()}
        isLoading={params.isLoadingSavingData}
        disabled={params.isLoadingSavingData}
      />
    </div>
  );
};
