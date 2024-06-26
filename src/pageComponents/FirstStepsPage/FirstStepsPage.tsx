import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { SetupProfileStep } from "./Views/SetupProfileStep";
import { ProgressRing } from "../../components/ProgressRing";
import { FinalStep } from "./Views/FinalStep";
import { Button } from "../../components/Button";
import { RoleEnum, DefineUserStep } from "./Views/DefineUserStep";
import type { ProfileData, UserIdentityData } from "../../utils/globalTypes";
import toast from "react-hot-toast";

enum StepsEnum {
  OnlinePresence,
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
  const router = useRouter();
  const ctx = api.useUtils();

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
      id: StepsEnum.Final,
      step: t("pages.firstSteps.stepIdentifier2"),
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
  const [isSavingData, setIsSaving] = useState<boolean>(false);

  const {
    control: userIdentityControl,
    register: userIdentityRegister,
    watch: userIdentityWatch,
    setValue: userIdentifySetValue,
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
      placeThatLives: { id: -1, name: "" },
      gender: { id: -1, name: "" },
      categories: [],
      profilePicture: "",
    },
  });

  const { data: user } = api.users.getUser.useQuery();

  const {
    data: usernameVerification,
    isLoading: usernameVeritifcationLoading,
    refetch: usernameVerificationRefetch,
  } = api.users.usernameExists.useQuery({
    username: userIdentityWatch("username") || "",
  });

  const {
    data: verifyVatNumber,
    refetch: refetchVerifyVatNumber,
    isRefetching: isRefetchingVatNumber,
    isFetching: isFetchingVatNumber,
  } = api.billings.checkVATWithVies.useQuery(
    {
      countryId: watch("nationOfBirth").id,
      vatNumber: watch("tin"),
    },
    {
      enabled: false,
    }
  );

  const { mutateAsync: profileMutation } =
    api.profiles.createProfile.useMutation({
      onSuccess: () => {
        void addPicture({
          picture: watch("profilePicture"),
        });
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: userIdentityMutation } =
    api.users.updateUserIdentity.useMutation({
      onSuccess: () => {
        setIsUserTypeFormComplete(true);

        setCurrentStep(generalSteps[0]);
        setSteps(generalSteps);
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: addPicture } = api.portfolios.createPicture.useMutation({
    onSuccess: async () => {
      await ctx.users.getUser.invalidate();

      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (user?.role) {
      setIsUserTypeFormComplete(true);

      setCurrentStep(generalSteps[0]);
      setSteps(generalSteps);
    }
  }, [user]);

  const submitStep0 = handleSubmitUserIdentityData((data) => {
    if (
      (userIdentityWatch("role")?.id === RoleEnum.Brand &&
        !usernameVerification) ||
      (userIdentityWatch("role")?.id === RoleEnum.Influencer &&
        !usernameVerification) ||
      userIdentityWatch("role")?.name !== ""
    ) {
      userIdentityMutation({
        role: data.role,
        username: data.username,
        isOver18: data.is18,
      });
    }
  });

  const submitStep1 = handleSubmitProfileData(() => {
    changeStep("next");
  });

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

  const saveAllData = async () => {
    setIsSaving(true);
    const profileData = getValuesProfile();

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
        city: {
          id: profileData.placeThatLives.id,
          name: profileData.placeThatLives.name,
        },
        website: profileData.website,
        tin: profileData.tin,
      });

      void router.push(
        `/${userIdentityWatch("username") || user?.username || ""}`
      );
    }
  };

  const renderSteps = () => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 rounded-tl-2xl bg-light-red px-4 py-4 text-center sm:p-4 lg:w-[40%] lg:items-start lg:gap-4 lg:overflow-y-hidden lg:rounded-l-2xl lg:rounded-br-none lg:p-8 lg:text-left 2xl:w-[30%]">
        <h1 className=" cursor-pointer font-lobster text-2xl text-influencer lg:p-8 lg:text-4xl">
          Influencer Markt
        </h1>
        <div className="m-auto hidden justify-center lg:flex">
          <ProgressRing
            radius={150}
            stroke={25}
            progress={((stepsCount + 1) / steps.length) * 100}
            progressText={`${stepsCount + 1}/${steps.length}`}
            fontSize="big"
          />
        </div>

        <div className="flex items-center gap-2 lg:flex-col lg:items-start lg:gap-0">
          <div className="flex lg:hidden">
            <ProgressRing
              radius={40}
              stroke={7}
              progress={((stepsCount + 1) / steps.length) * 100}
              progressText={`${stepsCount + 1}/${steps.length}`}
              fontSize="normal"
            />
          </div>

          <div className="hidden justify-center text-xl font-medium lg:flex lg:justify-start">
            <div>{currentStep?.step}</div>
          </div>
          <div className="flex flex-col lg:gap-2">
            <div className="text-xl font-semibold sm:text-2xl lg:text-4xl">
              {currentStep?.title}{" "}
            </div>
            <div className="hidden text-sm font-medium text-gray2 sm:text-base lg:flex lg:text-lg">
              {currentStep?.subTitle}
            </div>
            <div className="text-base font-medium text-gray2 lg:hidden lg:text-lg">
              {steps[stepsCount + 1]?.title
                ? `${t("pages.firstSteps.next")}: ${
                    steps[stepsCount + 1]?.title || ""
                  } `
                : ""}
            </div>
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

  const renderProfileForm = () => {
    let isDisabled = true;

    if (
      watch("displayName") !== "" &&
      watch("categories").length > 0 &&
      watch("about") !== "" &&
      watch("nationOfBirth")?.id !== -1 &&
      watch("placeThatLives")?.id !== -1
    ) {
      if (user?.roleId === 1 && verifyVatNumber) {
        isDisabled = false;
      } else if (user?.roleId === 2) {
        isDisabled = false;
      }
    }

    return (
      <main className="h-full w-full bg-shadow-gray p-6 lg:p-8">
        <div className="flex h-full w-full flex-col rounded-2xl bg-white lg:flex-row lg:overscroll-none">
          {renderSteps()}

          <div
            ref={mainContentRef}
            className="flex h-full w-full flex-col overflow-y-auto sm:px-8 lg:overscroll-none"
          >
            {renderStepMainTitle()}
            <SetupProfileStep
              control={control}
              register={register}
              setValue={setValue}
              submit={submitStep1}
              errors={errors}
              watch={watch}
              refetchVerifyVatNumber={refetchVerifyVatNumber}
              verifyVatNumber={verifyVatNumber}
              isRefetchingVatNumber={
                isRefetchingVatNumber || isFetchingVatNumber
              }
            />
            <div className="flex-2 flex w-full flex-col justify-end gap-4 p-4 sm:flex-row sm:items-end sm:gap-0">
              <Button
                title={t("pages.firstSteps.nextStep")}
                level="primary"
                form="form-hook"
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </main>
    );
  };

  const renderFinalStep = () => {
    return (
      <main className="h-full w-full bg-shadow-gray p-6 lg:p-8">
        <div className="flex h-full w-full flex-col rounded-2xl bg-white lg:flex-row lg:overscroll-none">
          {renderSteps()}

          <div
            ref={mainContentRef}
            className="flex h-full w-full flex-col overflow-y-auto sm:px-8 lg:overscroll-none"
          >
            <div className="mt-6 flex h-full w-full flex-1 flex-col justify-center gap-8 p-4 sm:mt-0">
              {renderStepMainTitle()}
              <FinalStep
                changeStep={changeStep}
                saveAllData={saveAllData}
                isLoadingSavingData={isSavingData}
              />
            </div>

            <div className="flex-2 flex w-full flex-col justify-start gap-4 p-4 sm:flex-row sm:items-end sm:gap-0">
              <Button
                title={t("pages.firstSteps.previousStep")}
                level="secondary"
                onClick={() => changeStep("previous")}
              />
            </div>
          </div>
        </div>
      </main>
    );
  };

  const renderUserTypeForm = () => {
    let isDisabled = true;

    if (
      userIdentityWatch("role")?.name !== "" &&
      userIdentityWatch("is18") === true &&
      userIdentityWatch("username") !== "" &&
      usernameVerification === false
    ) {
      isDisabled = false;
    }

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
              setValue={userIdentifySetValue}
              usernameVerification={!usernameVerification}
            />
            <div className="flex-2 flex w-full flex-col justify-center gap-4 p-4 py-4 sm:flex-row sm:items-end sm:gap-0">
              <Button
                title={t("pages.firstSteps.defineUserStep.button")}
                level="primary"
                form="form-user"
                size="regular"
                disabled={isDisabled}
                isLoading={usernameVeritifcationLoading}
              />
            </div>
          </div>
        </div>
      </main>
    );
  };

  if (!isUserTypeFormComplete) {
    return renderUserTypeForm();
  } else if (
    isUserTypeFormComplete &&
    currentStep?.id === StepsEnum.OnlinePresence
  ) {
    return renderProfileForm();
  } else if (isUserTypeFormComplete && currentStep?.id === StepsEnum.Final) {
    return renderFinalStep();
  }
};

export { FirstStepsPage };
