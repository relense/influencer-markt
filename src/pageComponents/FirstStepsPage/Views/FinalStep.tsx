import Link from "next/link";
import { Button } from "../../../components/Button";
import { useTranslation } from "react-i18next";

export const FinalStep = (params: {
  changeStep: (value: "next" | "previous") => void;
  saveAllData: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center gap-8">
      <form id="form-hook" onSubmit={() => params.changeStep("next")} />
      <Link href="/" className="hidden flex-1 justify-center sm:flex">
        <Button
          title={t("pages.firstSteps.finalStep.button")}
          level="primary"
          size="large"
          onClick={() => params.saveAllData()}
        />
      </Link>
    </div>
  );
};
