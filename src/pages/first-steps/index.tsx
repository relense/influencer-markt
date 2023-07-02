import { type NextPage } from "next";
import { FirstStepsPage } from "../../pageComponents/FirstStepsPage/FirstStepsPage";
import { ProtectedLayout } from "../../components/ProtectedWrapper";

const FirstSteps: NextPage = () => {
  return (
    <ProtectedLayout>
      <FirstStepsPage />
    </ProtectedLayout>
  );
};

export default FirstSteps;
