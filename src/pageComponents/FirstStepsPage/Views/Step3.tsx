import { StepsReminder } from "../../../components/StepsReminder";
import { PictureCarrosel } from "../../../components/PictureCarrosel";

export const Step3 = (params: {
  changeStep: (value: "next" | "previous") => void;
}) => {
  return (
    <div className="mt-2 flex w-full flex-1 flex-col gap-4 sm:items-center lg:mt-11 lg:overflow-y-auto">
      <form id="form-hook" onSubmit={() => params.changeStep("next")} />
      <PictureCarrosel visual={false} portfolio={[]} />
      <StepsReminder />
    </div>
  );
};
