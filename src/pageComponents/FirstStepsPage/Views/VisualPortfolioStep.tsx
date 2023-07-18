import { StepsReminder } from "../../../components/StepsReminder";
import {
  type Picture,
  PictureCarrosel,
} from "../../../components/PictureCarrosel";

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
