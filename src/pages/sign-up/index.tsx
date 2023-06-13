import { type NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCamera,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../components/Button/Button";

type Step = {
  step: string;
  title: string;
  subTitle: string;
  mainTitle: string;
  mainSubTitle: string;
};

const steps: Step[] = [
  {
    step: "Step 1",
    title: "Online Presence",
    subTitle: "Define Your Online Profile identity",
    mainTitle: "Establish Your Online Presence",
    mainSubTitle:
      "Let's Establish who you are and what defines your online identity",
  },
  {
    step: "Step 2",
    title: "Social Media",
    subTitle: "Share your social media accounts",
    mainTitle: "Connect and Showcase Your Influence",
    mainSubTitle: "Fill in Relevant Details, Leave the Rest Optional",
  },
  {
    step: "Step 3",
    title: "Visual Portfolio",
    subTitle: "Create a portfolio related with your needs",
    mainTitle: "Build Your Visual Portfolio",
    mainSubTitle: "Showcase Your Best Photos on Your Profile",
  },
  {
    step: "Step 4",
    title: "Value Packs",
    subTitle: "Design Your Profitable Value Packs",
    mainTitle: "Customized Value Packs",
    mainSubTitle: "Select Your Platform and Craft Your Irresistible Offer",
  },
  {
    step: "",
    title: "You're All Set",
    subTitle: "Start Exploring the Exciting Opportunities Ahead!",
    mainTitle: "Congratulations! You're All Set to Unleash Your Influence",
    mainSubTitle:
      "Welcome to the World of Endless Possibilities and Impactful Connections",
  },
];

const SignUp: NextPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const changeStep = (type: "next" | "previous") => {
    if (type === "next") {
      if (currentStep === steps.length - 1) return;

      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCloseButton = () => {
    return (
      <Link href="/">
        <div className="absolute right-1 top-1 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-influencer-green lg:right-10 lg:top-10">
          <FontAwesomeIcon
            icon={faXmark}
            className="fa-2x cursor-pointer text-white"
          />
        </div>
      </Link>
    );
  };

  const renderLogo = () => {
    return (
      <h1 className="cursor-pointer justify-center p-4 text-center font-lobster text-2xl text-influencer lg:m-8 lg:text-left lg:text-4xl">
        Influencer Markt
      </h1>
    );
  };

  const renderSteps = () => {
    return (
      <div className="flex flex-col gap-4 rounded-b-2xl bg-light-red p-4 lg:p-8">
        <div className="text-lg font-medium lg:text-xl">
          {steps[currentStep]?.step}
        </div>
        <div className="text-2xl font-semibold lg:text-4xl">
          {steps[currentStep]?.title}
        </div>
        <div className="text-base font-medium text-gray2 lg:text-lg">
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
      </div>
    );
  };

  const renderStepperMobile = () => {
    return (
      <div className="flex h-full w-full flex-1 flex-col justify-between lg:hidden">
        {renderLogo()}
        {currentStep === 0 && renderStep1()}
        {renderSteps()}
      </div>
    );
  };

  const renderTitle = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4 font-playfair">
        <div className="text-4xl">{steps[currentStep]?.mainTitle}</div>
        <div className="text-xl">{steps[currentStep]?.mainSubTitle}</div>
      </div>
    );
  };

  const renderStepperButtons = () => {
    return (
      <div className="flex flex-1 items-center justify-between">
        {currentStep > 0 && (
          <div>
            <Button
              title="Previous Step"
              level="secondary"
              onClick={() => changeStep("previous")}
            />
          </div>
        )}
        <div className="flex flex-1 items-center justify-end">
          <div
            className="cursor-pointer underline"
            onClick={() => changeStep("next")}
          >
            Skip Step
          </div>
          <Button
            title="Next Step"
            level="primary"
            onClick={() => changeStep("next")}
          />
        </div>
      </div>
    );
  };

  const renderStepperDesktop = () => {
    return (
      <div className="hidden h-full lg:flex">
        <div className="flex h-full w-1/4 flex-col justify-between rounded-s-2xl bg-light-red">
          {renderLogo()}
          {renderSteps()}
        </div>
        <div className="flex w-full flex-col p-12">
          {renderTitle()}
          <div className="mt-11 flex flex-1 justify-center">
            {renderStep1()}
          </div>
          <div className="flex">{renderStepperButtons()}</div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
          <div className="flex items-center gap-4 text-influencer">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            <div>Add your Profile Image</div>
          </div>
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
