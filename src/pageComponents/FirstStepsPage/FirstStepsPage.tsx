import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import Link from "next/link";

import { SetupProfileStep } from "./Views/SetupProfileStep";
import { SocialMediaStep } from "./Views/SocialMediaStep";

import { ProgressRing } from "../../components/ProgressRing";
import { VisualPortfolioStep } from "./Views/VisualPortfolioStep";
import { FinalStep } from "./Views/FinalStep";
import { Button } from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { RoleEnum, DefineUserStep } from "./Views/DefineUserStep";
import { useTranslation } from "react-i18next";
import type {
  Picture,
  ProfileData,
  SocialMediaData,
  UserIdentityData,
} from "../../utils/globalTypes";

enum StepsEnum {
  OnlinePresence,
  SocialMedia,
  VisualPortfolio,
  Final,
}

type Step = {
  id: StepsEnum;
  step: string;
  title: string;
  subTitle: string;
  mainTitle: string;
  mainSubTitle: string;
};

const FirstStepsPage = () => {
  const { t } = useTranslation();

  const generalSteps: Step[] = [
    {
      id: StepsEnum.OnlinePresence,
      step: t("pages.firstSteps.stepIdentifier1"),
      title: t("pages.firstSteps.setupProfileStep.title"),
      subTitle: t("pages.firstSteps.setupProfileStep.subTitle"),
      mainTitle: t("pages.firstSteps.setupProfileStep.mainTitle"),
      mainSubTitle: t("pages.firstSteps.setupProfileStep.mainSubTitle"),
    },
    {
      id: StepsEnum.SocialMedia,
      step: t("pages.firstSteps.stepIdentifier2"),
      title: t("pages.firstSteps.socialMediaStep.title"),
      subTitle: t("pages.firstSteps.socialMediaStep.subTitle"),
      mainTitle: t("pages.firstSteps.socialMediaStep.mainTitle"),
      mainSubTitle: t("pages.firstSteps.socialMediaStep.mainSubTitle"),
    },
    {
      id: StepsEnum.VisualPortfolio,
      step: t("pages.firstSteps.stepIdentifier3"),
      title: t("pages.firstSteps.visualPortfolioStep.title"),
      subTitle: t("pages.firstSteps.visualPortfolioStep.subTitle"),
      mainTitle: t("pages.firstSteps.visualPortfolioStep.mainTitle"),
      mainSubTitle: t("pages.firstSteps.visualPortfolioStep.mainSubTitle"),
    },

    {
      id: StepsEnum.Final,
      step: t("pages.firstSteps.stepIdentifier4"),
      title: t("pages.firstSteps.finalStep.title"),
      subTitle: t("pages.firstSteps.finalStep.subTitle"),
      mainTitle: t("pages.firstSteps.finalStep.mainTitle"),
      mainSubTitle: t("pages.firstSteps.finalStep.mainSubTitle"),
    },
  ];

  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isUserTypeFormComplete, setIsUserTypeFormComplete] =
    useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>(generalSteps);
  const [currentStep, setCurrentStep] = useState<Step>();
  const [stepsCount, setStepsCount] = useState<number>(0);
  const [portfolio, setPortfolio] = useState<Picture[]>([]);

  const {
    control: userIdentityControl,
    register: userIdentityRegister,
    watch: userIdentityWatch,
    handleSubmit: handleSubmitUserIdentityData,
  } = useForm<UserIdentityData>({
    defaultValues: {
      role: { id: -1, name: "" },
    },
  });

  const {
    control,
    register,
    setValue,
    watch,
    getValues: getValuesProfile,
    handleSubmit: handleSubmitProfileData,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {
      nationOfBirth: { id: -1, name: "" },
      placeThatLives: "",
      gender: { id: -1, name: "" },
      categories: [],
      profilePicture: "",
    },
  });

  const {
    getValues: getValuesSocialMedia,
    setValue: setValueSocialMedia,
    register: registerSocialMedia,
    handleSubmit: handleSubmitSocialMediaData,
  } = useForm<SocialMediaData>();

  const { data: user } = api.users.getUser.useQuery();
  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();

  const {
    data: usernameVerification,
    isLoading: usernameVeritifcationLoading,
    refetch: usernameVerificationRefetch,
  } = api.users.usernameExists.useQuery({
    username: userIdentityWatch("username") || "",
  });

  const { mutate } = api.users.updateUserFirstSteps.useMutation();
  const { mutateAsync: profileMutation } =
    api.profiles.createProfile.useMutation();
  const { mutate: userSocialMediaMutation } =
    api.userSocialMedias.createUserSocialMedias.useMutation();

  const { mutate: userIdentityMutation } =
    api.users.updateUserIdentity.useMutation({
      onSuccess: () => {
        updateStepper();
      },
    });

  const submitStep0 = handleSubmitUserIdentityData((data) => {
    if (
      (userIdentityWatch("role")?.id === RoleEnum.Brand &&
        usernameVerification) ||
      (userIdentityWatch("role")?.id === RoleEnum.Influencer &&
        usernameVerification) ||
      userIdentityWatch("role")?.name !== ""
    ) {
      if (userIdentityWatch("role")?.id === RoleEnum.Individual) {
        userIdentityMutation({
          role: data.role,
          username: "",
        });
      } else {
        userIdentityMutation({
          role: data.role,
          username: data.username,
        });
      }
    }
  });

  const submitStep1 = handleSubmitProfileData(() => {
    changeStep("next");
  });

  const submitStep2 = handleSubmitSocialMediaData(() => {
    changeStep("next");
  });

  useEffect(() => {
    if (user?.role) {
      updateStepper();
    }
  }, [user]);

  const updateStepper = () => {
    setIsUserTypeFormComplete(true);

    setCurrentStep(generalSteps[0]);
    setSteps(generalSteps);
  };

  const changeStep = (type: "next" | "previous") => {
    if (mainContentRef.current) {
      mainContentRef.current.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
    if (type === "next" && currentStep) {
      if (currentStep.id === StepsEnum.Final) return;

      setStepsCount(stepsCount + 1);
      setCurrentStep(steps[stepsCount + 1]);
    } else {
      setStepsCount(stepsCount - 1);
      setCurrentStep(steps[stepsCount - 1]);
    }
  };

  const onAddPicture = (pictureUrl: string) => {
    const newPortfolio = [...portfolio];
    newPortfolio.push({ id: newPortfolio.length, url: pictureUrl });
    setPortfolio(newPortfolio);
  };

  const onDeletePicture = (pictureId: number) => {
    const newPortfolio = [...portfolio];

    const index = newPortfolio.map((picture) => picture.id).indexOf(pictureId);

    if (index > -1) {
      newPortfolio.splice(index, 1);
    }

    setPortfolio(newPortfolio);
  };

  const saveAllData = async () => {
    const profileData = getValuesProfile();
    const socialMediaData = getValuesSocialMedia();

    if (
      profileData &&
      profileData.displayName &&
      profileData.categories.length > 0
    ) {
      await profileMutation({
        displayName: profileData.displayName,
        profilePicture: profileData.profilePicture,
        categories: profileData.categories,
        gender: { id: profileData.gender.id, name: profileData.gender.name },
        about: profileData.about,
        country: {
          id: profileData.nationOfBirth.id,
          name: profileData.nationOfBirth.name,
        },
        city: profileData.placeThatLives,
        website: profileData.website,
      });
    }

    if (socialMediaData && socialMediaData?.socialMedia) {
      const newSocialMediaData = socialMediaData.socialMedia.map(
        (socialMedia) => {
          return {
            handler: socialMedia.socialMediaHandler,
            followers: socialMedia.socialMediaFollowers,
            socialMedia: socialMedia.platform,
            valuePacks: socialMedia.valuePacks.map((valuePack) => {
              return {
                platformId: valuePack.platform.id,
                contentTypeId: valuePack.contentType.id,
                deliveryTime: parseInt(valuePack.deliveryTime),
                numberOfRevisions: parseInt(valuePack.numberOfRevisions),
                valuePackPrice: parseInt(valuePack.valuePackPrice),
              };
            }),
          };
        }
      );

      userSocialMediaMutation(newSocialMediaData);
    }

    mutate({ firstSteps: true });
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
      <div className="flex flex-col items-center justify-between gap-2 rounded-tl-2xl bg-light-red px-4 py-4 text-center sm:p-4 lg:w-[40%] lg:items-start lg:gap-4 lg:overflow-y-hidden lg:rounded-l-2xl lg:rounded-br-none lg:p-8 lg:text-left 2xl:w-[30%]">
        <h1 className=" cursor-pointer font-lobster text-2xl text-influencer lg:p-8 lg:text-4xl">
          Influencer Markt
        </h1>
        <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
          <div className="flex sm:hidden">
            <ProgressRing
              radius={40}
              stroke={7}
              progress={((stepsCount + 1) / steps.length) * 100}
              progressText={`${stepsCount + 1}/${steps.length}`}
              underBarColor={"influencer"}
              upperBarColor={"influencer-green"}
            />
          </div>
          <div className="hidden justify-center text-xl font-medium lg:flex lg:justify-start">
            <div>{currentStep?.step}</div>
          </div>
          <div className="flex flex-col sm:gap-2">
            <div className="text-xl font-semibold sm:text-2xl lg:text-4xl">
              {currentStep?.title}{" "}
            </div>
            <div className="hidden text-sm font-medium text-gray2 sm:flex sm:text-base lg:text-lg">
              {currentStep?.subTitle}
            </div>
            <div className="text-base font-medium text-gray2 sm:hidden lg:text-lg">
              {steps[stepsCount + 1]?.title
                ? `${t("pages.firstSteps.next")}: ${
                    steps[stepsCount + 1]?.title || ""
                  } `
                : ""}
            </div>
          </div>
          <div className="hidden flex-wrap justify-center gap-3 py-2 sm:flex sm:justify-normal lg:pt-4">
            {steps.map((step, index) => {
              if (index <= stepsCount) {
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
      <div className="flex flex-col items-center justify-center gap-4 px-2 py-4 text-center font-playfair lg:mt-12 lg:py-0">
        <div className="text-2xl sm:text-4xl">{currentStep?.mainTitle}</div>
        <div className="text-base text-gray2 sm:text-xl">
          {currentStep?.mainSubTitle}
        </div>
      </div>
    );
  };

  const renderStepperButtons = () => {
    return (
      <div className="flex-2 flex w-full flex-col justify-between gap-4 p-4 sm:flex-row sm:items-end sm:gap-0">
        <div className="flex justify-center">
          {stepsCount > 0 && (
            <Button
              title={t("pages.firstSteps.previousStep")}
              level="secondary"
              onClick={() => changeStep("previous")}
            />
          )}
        </div>
        <div className="flex items-center justify-center gap-4 lg:flex-row">
          {stepsCount < steps.length - 1 && (
            <>
              {stepsCount > 0 && (
                <div
                  className="hidden cursor-pointer underline lg:flex"
                  onClick={() => changeStep("next")}
                >
                  {t("pages.firstSteps.skipStep")}
                </div>
              )}

              <Button
                title={t("pages.firstSteps.nextStep")}
                level="primary"
                form="form-hook"
              />
            </>
          )}

          {stepsCount === steps.length - 1 && (
            <Link href="/" className="flex flex-1 justify-center sm:hidden">
              <Button
                title={t("pages.firstSteps.getStarted")}
                level="primary"
              />
            </Link>
          )}
        </div>
      </div>
    );
  };

  const renderFirstSteps = () => {
    return (
      <main className="h-full w-full bg-shadow-gray p-6 lg:p-8">
        <div className="flex h-full w-full flex-col rounded-2xl bg-white lg:flex-row lg:overscroll-none">
          {renderSteps()}

          <div
            ref={mainContentRef}
            className="flex h-full w-full flex-col overflow-y-auto sm:px-8 lg:overscroll-none"
          >
            {currentStep?.id !== StepsEnum.Final && renderStepMainTitle()}
            {currentStep?.id === StepsEnum.OnlinePresence && (
              <SetupProfileStep
                control={control}
                register={register}
                setValue={setValue}
                submit={submitStep1}
                errors={errors}
                watch={watch}
              />
            )}
            {currentStep?.id === StepsEnum.SocialMedia && (
              <SocialMediaStep
                registerSocialMedia={registerSocialMedia}
                platforms={platforms}
                setValue={setValueSocialMedia}
                getValues={getValuesSocialMedia}
                submit={submitStep2}
                isBrand={user?.role?.name === "Brand"}
              />
            )}
            {currentStep?.id === StepsEnum.VisualPortfolio && (
              <VisualPortfolioStep
                changeStep={changeStep}
                porttoflio={portfolio}
                addPicture={onAddPicture}
                deletePicture={onDeletePicture}
              />
            )}
            {currentStep?.id === StepsEnum.Final && (
              <div className="mt-6 flex h-full w-full flex-1 flex-col justify-center gap-8 p-4 sm:mt-0">
                {renderStepMainTitle()}
                <FinalStep changeStep={changeStep} saveAllData={saveAllData} />
              </div>
            )}
            {renderStepperButtons()}
          </div>
        </div>
      </main>
    );
  };

  const renderUserTypeForm = () => {
    return (
      <main className="h-full w-full bg-shadow-gray p-6 lg:p-8">
        <div className="flex h-full w-full flex-col rounded-2xl bg-white lg:flex-row lg:overscroll-none">
          <div
            ref={mainContentRef}
            className="flex h-full w-full flex-col overflow-y-auto sm:px-8 lg:overscroll-none"
          >
            <div className="flex flex-col items-center justify-center gap-4 p-4 text-center font-playfair lg:mt-12 lg:py-0">
              <div className="text-2xl sm:text-4xl">
                {t("pages.firstSteps.defineUserStep.title")}
              </div>
              <div className="text-base text-gray2 sm:text-xl">
                {t("pages.firstSteps.defineUserStep.subTitle")}
              </div>
            </div>
            <DefineUserStep
              control={userIdentityControl}
              register={userIdentityRegister}
              watch={userIdentityWatch}
              submit={submitStep0}
              refetch={usernameVerificationRefetch}
              usernameVerification={usernameVerification}
            />
            <div className="flex-2 flex w-full flex-col justify-center gap-4 p-4 py-4 sm:flex-row sm:items-end sm:gap-0">
              <Button
                title={t("pages.firstSteps.defineUserStep.button")}
                level="primary"
                form="form-user"
                size="regular"
                disabled={
                  (userIdentityWatch("role")?.id === RoleEnum.Brand &&
                    !usernameVerification) ||
                  (userIdentityWatch("role")?.id === RoleEnum.Influencer &&
                    !usernameVerification) ||
                  userIdentityWatch("role")?.name === ""
                }
                isLoading={usernameVeritifcationLoading}
              />
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <>
      {renderCloseButton()}
      {isUserTypeFormComplete ? renderFirstSteps() : renderUserTypeForm()}
    </>
  );
};

export { FirstStepsPage };
