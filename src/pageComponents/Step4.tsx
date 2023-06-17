import { StepsReminder } from "../components/StepsReminder/StepsReminder";

export const Step4 = (params: {
  changeStep: (value: "next" | "previous") => void;
}) => {
  return (
    <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
      <form id="form-hook" onSubmit={() => params.changeStep("next")} />
      <div className="flex flex-col items-center"></div>
      <StepsReminder />
    </div>
  );
};
