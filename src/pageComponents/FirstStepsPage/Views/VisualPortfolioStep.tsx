import { StepsReminder } from "../../../components/StepsReminder";
import { PictureCarrosel } from "../../../components/PictureCarrosel";
import { type Picture } from "../../../utils/globalTypes";

export const VisualPortfolioStep = (params: {
  changeStep: (value: "next" | "previous") => void;
  porttoflio: Picture[] | [];
  addPicture?: (pictureUrl: string) => void;
  deletePicture?: (pictureId: number) => void;
}) => {
  return (
    <div className="mt-2 flex w-full flex-1 flex-col gap-4 sm:items-center lg:mt-11 lg:overflow-y-auto">
      <form id="form-hook" onSubmit={() => params.changeStep("next")} />
      <PictureCarrosel
        visual={false}
        portfolio={params.porttoflio}
        addPicture={params.addPicture}
        deletePicture={params.deletePicture}
      />
      <StepsReminder />
    </div>
  );
};
