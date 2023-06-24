import { api } from "~/utils/api";
import { type NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "../../components/Button/Button";

import { Step3 } from "../../pageComponents/Step3";
import { type SocialMediaDetails, Step2 } from "../../pageComponents/Step2";
import { Step1 } from "../../pageComponents/Step1";
import { Step4, type ValuePack } from "../../pageComponents/Step4";
import { Step5 } from "../../pageComponents/Step5";
import { ProgressRing } from "../../components/ProgressRing/ProgressRing";
import { useForm } from "react-hook-form";
import { type Option } from "../../components/CustomMultiSelect/CustomMultiSelect";

type Step = {
  step: string;
  title: string;
  subTitle: string;
  mainTitle: string;
  mainSubTitle: string;
};

export type ProfileData = {
  profilePicture: string;
  displayName: string;
  role: Option;
  categories: Option[];
  country: string;
  city: string;
  about: string;
};

export type SocialMediaData = {
  website: string;
  socialMedia: SocialMediaDetails[];
};

export type ValuePacksData = {
  valuePacks: ValuePack[];
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
    step: "Step 5",
    title: "You're All Set",
    subTitle: "Start Exploring the Exciting Opportunities Ahead!",
    mainTitle: "Congratulations! You're All Set to Unleash Your Influence",
    mainSubTitle:
      "Welcome to the World of Endless Possibilities and Impactful Connections",
  },
];

const FirstSteps: NextPage = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { control, register, handleSubmit, setValue } = useForm<ProfileData>({
    defaultValues: {
      role: { id: -1, option: "" },
      categories: [],
      profilePicture: "",
    },
  });

  const {
    getValues: getValuesSocialMedia,
    setValue: setValueSocialMedia,
    register: registerSocialMedia,
    handleSubmit: handleSubmitSocialMedia,
    formState: { errors },
  } = useForm<SocialMediaData>();

  const {
    getValues: getValuesValuePacks,
    setValue: setValueValuePacks,
    handleSubmit: handleSubmitValuePacks,
  } = useForm<ValuePacksData>();

  const { data: categories } = api.users.getAllCategories.useQuery();
  const { data: roles } = api.users.getAllRoles.useQuery();
  const { data: platforms } = api.users.getAllSocialMedia.useQuery();
  const { mutate } = api.users.updateUser.useMutation();
  const { mutate: profileMutation } = api.users.createProfile.useMutation();

  const changeStep = (type: "next" | "previous") => {
    if (mainContentRef.current) {
      mainContentRef.current.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
    if (type === "next") {
      if (currentStep === steps.length - 1) return;

      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmitStep1 = handleSubmit((data) => {
    profileMutation({
      displayName: data.displayName,
      profilePicture: data.profilePicture,
      categories: data.categories.map((category) => ({
        id: category.id,
        name: category.option,
      })),
      role: { id: data.role.id, name: data.role.option },
      about: data.about,
      country: data.country,
      city: data.city,
    });

    changeStep("next");
  });

  const onSubmitStep2 = handleSubmitSocialMedia((data) => {
    changeStep("next");
  });

  const onSubmitStep4 = handleSubmitValuePacks((data) => {
    changeStep("next");
  });

  const renderCloseButton = () => {
    return (
      <Link href="/" onClick={() => mutate({ firstSteps: true })}>
        <div className="absolute right-1 top-1 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-influencer-green lg:right-2 lg:top-2">
          <FontAwesomeIcon
            icon={faXmark}
            className="fa-2x cursor-pointer text-white"
          />
        </div>
      </Link>
    );
  };

  const renderSteps = () => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 rounded-tl-2xl bg-light-red px-4 py-4 text-center sm:p-4 lg:w-[30%] lg:items-start lg:gap-4 lg:overflow-y-hidden lg:rounded-l-2xl lg:rounded-br-none lg:p-8 lg:text-left">
        <h1 className=" cursor-pointer font-lobster text-2xl text-influencer lg:p-8 lg:text-4xl">
          Influencer Markt
        </h1>
        <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
          <div className="flex sm:hidden">
            <ProgressRing
              radius={40}
              stroke={7}
              progress={((currentStep + 1) / steps.length) * 100}
              progressText={`${currentStep + 1}/${steps.length}`}
              underBarColor={"influencer"}
              upperBarColor={"influencer-green"}
            />
          </div>
          <div className="hidden justify-center text-xl font-medium lg:flex lg:justify-start">
            <div>{steps[currentStep]?.step}</div>
          </div>
          <div className="flex flex-col sm:gap-2">
            <div className="text-xl font-semibold sm:text-2xl lg:text-4xl">
              {steps[currentStep]?.title}{" "}
            </div>
            <div className="hidden text-sm font-medium text-gray2 sm:flex sm:text-base lg:text-lg">
              {steps[currentStep]?.subTitle}
            </div>
            <div className="text-base font-medium text-gray2 sm:hidden lg:text-lg">
              {steps[currentStep + 1]?.title
                ? `Next: ${steps[currentStep + 1]?.title || ""} `
                : ""}
            </div>
          </div>
          <div className="hidden flex-wrap justify-center gap-3 py-2 sm:flex sm:justify-normal lg:pt-4">
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
      </div>
    );
  };

  const renderStepMainTitle = () => {
    const hideMobile =
      currentStep < steps.length - 1
        ? "hidden flex-col items-center justify-center gap-4 font-playfair lg:mt-12 lg:flex"
        : "flex-col items-center text-center justify-center gap-4 font-playfair lg:mt-12 flex";
    return (
      <div className={hideMobile}>
        <div className="text-2xl sm:text-4xl">
          {steps[currentStep]?.mainTitle}
        </div>
        <div className="text-base text-gray2 sm:text-xl">
          {steps[currentStep]?.mainSubTitle}
        </div>
      </div>
    );
  };

  const renderStepperButtons = () => {
    return (
      <div className="flex-2 flex w-full flex-col justify-between gap-4 py-4 sm:flex-row sm:items-end sm:gap-0">
        <div className="flex justify-center">
          {currentStep > 0 && (
            <Button
              title="Previous Step"
              level="secondary"
              onClick={() => changeStep("previous")}
            />
          )}
        </div>
        <div className="flex items-center justify-center lg:flex-row">
          {currentStep < steps.length - 1 && (
            <>
              <div
                className="hidden cursor-pointer underline lg:flex"
                onClick={() => changeStep("next")}
              >
                Skip Step
              </div>

              <Button title="Next Step" level="primary" form="form-hook" />
            </>
          )}

          {currentStep === steps.length - 1 && (
            <Link href="/" className="flex flex-1 justify-center sm:hidden">
              <Button title="Get Started" level="primary" />
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderCloseButton()}
      <main className="h-full w-full bg-shadow-gray p-6 lg:p-8">
        <div className="flex h-full w-full flex-col rounded-2xl bg-white lg:flex-row lg:overscroll-none">
          {renderSteps()}

          <div
            ref={mainContentRef}
            className="flex h-full w-full flex-col overflow-y-auto sm:px-8 lg:overscroll-none"
          >
            {currentStep < steps.length - 1 && renderStepMainTitle()}
            {currentStep === 0 && (
              <Step1
                categories={categories}
                roles={roles}
                control={control}
                register={register}
                setValue={setValue}
                submit={onSubmitStep1}
              />
            )}
            {currentStep === 1 && (
              <Step2
                submit={onSubmitStep2}
                registerSocialMedia={registerSocialMedia}
                platforms={platforms}
                setValue={setValueSocialMedia}
                getValues={getValuesSocialMedia}
                errors={errors}
              />
            )}
            {currentStep === 2 && <Step3 changeStep={changeStep} />}
            {currentStep === 3 && (
              <Step4
                changeStep={changeStep}
                socialMedias={platforms}
                getValues={getValuesValuePacks}
                setValue={setValueValuePacks}
                submit={onSubmitStep4}
              />
            )}
            {currentStep === 4 && (
              <div className="mt-6 flex h-full w-full flex-1 flex-col justify-center gap-8 p-4 sm:mt-0">
                {renderStepMainTitle()}
                <Step5 changeStep={changeStep} />
              </div>
            )}
            {renderStepperButtons()}
          </div>
        </div>
      </main>
    </>
  );
};

export default FirstSteps;
