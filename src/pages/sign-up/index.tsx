import { type NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";

type Step = {
  step: string;
  title: string;
  subTitle: string;
};

const steps: Step[] = [
  {
    step: "Step 1",
    title: "Online Presence",
    subTitle: "Define Your Online Profile identity",
  },
  {
    step: "Step 2",
    title: "Social Media",
    subTitle: "Share your social media accounts",
  },
  {
    step: "Step 3",
    title: "Visual Portfolio",
    subTitle: "Create a portfolio related with your needs",
  },
  {
    step: "Step 4",
    title: "Value Packs",
    subTitle: "Design Your Profitable Value Packs",
  },
  {
    step: "",
    title: "You're All Set",
    subTitle: "Start Exploring the Exciting Opportunities Ahead!",
  },
];

const SignUp: NextPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const renderCloseButton = () => {
    return (
      <Link href="/">
        <div className="absolute right-1 top-1 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-influencer-green lg:right-10 lg:top-10">
          <FontAwesomeIcon
            icon={faXmark}
            className={`fa-2x cursor-pointer text-white`}
          />
        </div>
      </Link>
    );
  };

  const renderSteps = () => {
    return (
      <>
        <div className="text-lg">{steps[currentStep]?.step}</div>
        <div className="text-2xl">{steps[currentStep]?.title}</div>
        <div className="text-base text-gray2">
          {steps[currentStep]?.subTitle}
        </div>
        <div className="mt-4 flex gap-3">
          {steps.map((step, index) => {
            if (index <= currentStep) {
              return (
                <div
                  key={step.step}
                  className="h-2 w-11 rounded-2xl bg-influencer-green"
                />
              );
            } else {
              return (
                <div
                  key={step.step}
                  className="h-2 w-11 rounded-2xl bg-white"
                />
              );
            }
          })}
        </div>
      </>
    );
  };

  const renderStepperMobile = () => {
    return (
      <div className="flex h-full w-full flex-1 flex-col justify-between lg:hidden">
        <h1 className="flex cursor-pointer justify-center p-4 text-center font-lobster text-2xl text-influencer ">
          Influencer Markt
        </h1>
        <div className="flex">doadoa</div>
        <div className="flex flex-col gap-4 rounded-b-2xl bg-light-red p-4">
          {renderSteps()}
        </div>
      </div>
    );
  };

  const renderStepperDesktop = () => {
    return (
      <div className="hidden h-full w-96 flex-col justify-between rounded-s-2xl bg-light-red lg:flex">
        <h1 className="m-8 cursor-pointer text-left font-lobster text-4xl text-influencer">
          Influencer Markt
        </h1>
        <div className="flex flex-col gap-4 rounded-b-2xl bg-light-red p-4">
          {renderSteps()}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderCloseButton()}
      <main className="h-screen w-full bg-shadow-gray p-6 lg:p-16">
        <div className="h-full w-full rounded-2xl bg-white">
          {renderStepperDesktop()}
          {renderStepperMobile()}
        </div>
      </main>
    </>
  );
};

export default SignUp;
