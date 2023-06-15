import { type NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCamera,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomSelect } from "../../components/CustomSelect/CustomSelect";
import { Button } from "../../components/Button/Button";

type ProfileData = {
  displayName: string;
  role: "brand" | "individual" | "creator";
  categories: string[];
  country: string;
  city: string;
  about: string;
};

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

type SocialMediaInput = {
  socialMedia: string;
  placeholderTitle: string;
  placeholderSubtitle: string;
};

const socialMediaPlaceHolders: SocialMediaInput[] = [
  {
    socialMedia: "instagram",
    placeholderTitle: "Instagram Handle: Share Your @Username",
    placeholderSubtitle: "Instagram Followers",
  },
  {
    socialMedia: "twitter",
    placeholderTitle: "Twitter Handle: Enter Your @Username",
    placeholderSubtitle: "Twitter Followers",
  },
  {
    socialMedia: "tiktok",
    placeholderTitle: "TikTok Username: Share Your TikTok Handle",
    placeholderSubtitle: "TikTok Followers",
  },
  {
    socialMedia: "youtube",
    placeholderTitle: "YouTube Channel: Enter Your YouTube Username",
    placeholderSubtitle: "YouTube Subscribers",
  },
  {
    socialMedia: "facebook",
    placeholderTitle: "Facebook Page: Provide Your Facebook Page URL",
    placeholderSubtitle: "Facebook Followers",
  },
  {
    socialMedia: "linkedin",
    placeholderTitle: "LinkedIn Profile: Share Your LinkedIn Profile URL",
    placeholderSubtitle: "LinkedIn Connections",
  },
  {
    socialMedia: "pinterest",
    placeholderTitle: "Pinterest Account: Enter Your Pinterest Profile URL",
    placeholderSubtitle: "Pinterest Followers",
  },
  {
    socialMedia: "twitch",
    placeholderTitle: "Twitch Channel: Provide Your Twitch Channel Nam",
    placeholderSubtitle: "Twitch Followers",
  },
];

const FirstSteps: NextPage = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileData>();

  const {
    register: registerSocialMedia,
    handleSubmit: handleSubmitSocialMedia,
    formState: { errors: errorsSocialMedia },
  } = useForm();

  const handleRoleChange = (value: string) => {
    if (value === "brand" || value === "individual" || value === "creator")
      setValue("role", value);
  };

  const onSubmitStep1 = handleSubmit((data) => {
    changeStep("next");
  });

  const onSubmitStep2 = handleSubmitSocialMedia((data) => {
    alert(JSON.stringify(data));
    changeStep("next");
  });

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

  const renderCloseButton = () => {
    return (
      <Link href="/">
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
        <div>
          <div className="text-xl font-medium">{steps[currentStep]?.step}</div>
          <div className="text-2xl font-semibold lg:text-4xl">
            {steps[currentStep]?.title}
          </div>
          <div className="hidden text-base font-medium text-gray2 lg:flex lg:text-lg">
            {steps[currentStep]?.subTitle}
          </div>
          <div className="flex flex-wrap justify-center gap-3 py-2 sm:flex-nowrap sm:justify-normal lg:pt-4">
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
    return (
      <div className="hidden flex-col items-center justify-center gap-4 font-playfair lg:mt-12 lg:flex">
        <div className="text-4xl">{steps[currentStep]?.mainTitle}</div>
        <div className="text-xl">{steps[currentStep]?.mainSubTitle}</div>
      </div>
    );
  };

  const renderStepperButtons = () => {
    return (
      <div className="flex w-full flex-1 flex-col justify-between gap-4 py-4 sm:flex-row sm:items-end sm:gap-0">
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
            <div
              className="hidden cursor-pointer underline lg:flex"
              onClick={() => changeStep("next")}
            >
              Skip Step
            </div>
          )}
          <Button title="Next Step" level="primary" form="form-hook" />
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="mt-2 flex flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
        <div className="flex flex-col items-center">
          <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 text-center text-influencer sm:gap-4">
            <div className="hidden sm:flex">
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </div>
            <div>Add your Profile Image</div>
          </div>
        </div>
        <form
          id="form-hook"
          onSubmit={onSubmitStep1}
          className="smm:w-full mt-4 flex w-3/4 flex-col gap-6 lg:w-2/4"
        >
          <input
            {...register("displayName")}
            type="text"
            className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Choose Your Display Name: How Would You Like to be Recognized?"
          />
          <CustomSelect
            placeholder="Specify Your Role: Influencer, Brand, or Individual"
            options={[
              { id: "brand", option: "Brand" },
              { id: "creator", option: "Content Creator" },
              { id: "individual", option: "Individual" },
            ]}
            handleOptionSelect={handleRoleChange}
          />
          <input
            {...register("categories")}
            type="text"
            className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Choose Your Categories: e.g., Fashion, Travel, Fitness"
          />
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
            <input
              {...register("country")}
              type="text"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder="Country"
            />
            <input
              {...register("city")}
              type="text"
              className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder="City"
            />
          </div>
          <textarea
            {...register("about")}
            className="h-48 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Introduce Yourself: Share a Brief Description or Bio"
          />
        </form>
        {renderReminder()}
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="mt-2 flex flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
        <form
          id="form-hook"
          onSubmit={onSubmitStep2}
          className="mt-4 flex w-3/4 flex-col gap-6 sm:w-full lg:w-3/4"
        >
          <input
            {...registerSocialMedia("website")}
            type="text"
            className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Website URL: Provide Your Website Address"
          />
          {socialMediaPlaceHolders.map((item) => {
            return (
              <div
                key={item.placeholderTitle}
                className="flex flex-col gap-6 lg:flex-row"
              >
                <input
                  {...registerSocialMedia(`${item.socialMedia}Handle`)}
                  type="text"
                  className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
                  placeholder={item.placeholderTitle}
                />
                <input
                  {...registerSocialMedia(`${item.socialMedia}Followers`)}
                  type="text"
                  className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
                  placeholder={item.placeholderSubtitle}
                />
              </div>
            );
          })}
        </form>
        {renderReminder()}
      </div>
    );
  };

  const renderReminder = () => {
    return (
      <div className="px-4 text-center text-sm">
        <span>Update and Modify this Information at Any Time in Your</span>{" "}
        <span className="font-extrabold">Dashboard</span>
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
            {renderStepMainTitle()}
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {renderStepperButtons()}
          </div>
        </div>
      </main>
    </>
  );
};

export default FirstSteps;
