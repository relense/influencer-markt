import Link from "next/link";
import { Button } from "../../../components/Button";

export const Step5 = (params: {
  changeStep: (value: "next" | "previous") => void;
  saveAllData: () => void;
}) => {
  return (
    <div className="flex w-full items-center gap-8">
      <form id="form-hook" onSubmit={() => params.changeStep("next")} />
      <Link href="/" className="hidden flex-1 justify-center sm:flex">
        <Button
          title="Get Started"
          level="primary"
          size="large"
          onClick={() => params.saveAllData()}
        />
      </Link>
    </div>
  );
};
