import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import type { Option } from "../../utils/globalTypes";
import { helper, usePrevious } from "../../utils/helper";
import { CustomSelect } from "../../components/CustomSelect";
import { CustomMultiSelect } from "../../components/CustomMultiSelect";
import { ToolTip } from "../../components/ToolTip";
import { Button } from "../../components/Button";
import { LoadingSpinner } from "../../components/LoadingSpinner";

type JobData = {
  jobSummary: string;
  jobDetails: string;
  platform: Option;
  categories: Option[];
  jobPrice: number;
  numberOfInfluencers: number;
  country: Option;
  minFollowers: number;
  gender: Option;
  published: boolean;
};

type ContentTypeWithQuantity = {
  contentType: Option;
  amount: number;
};

const CreateJobPage = (params: { edit: boolean; jobId: number }) => {
  const { t } = useTranslation();
  const ctx = api.useContext();
  const router = useRouter();

  const [contentTypesList, setContentTypesList] = useState<
    ContentTypeWithQuantity[]
  >([{ contentType: { id: -1, name: "" }, amount: 0 }]);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const {
    data: job,
    refetch: refetchJob,
    isLoading: isLoadingJob,
  } = api.jobs.getJob.useQuery(
    {
      jobId: params.jobId,
    },
    {
      enabled: false,
    }
  );

  const prevContentTypes = usePrevious(job?.contentTypeWithQuantity || null);

  const prevGender = usePrevious(job?.gender || null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<JobData>({
    defaultValues: {
      categories: [],
      platform: { id: -1, name: "" },
      country: { id: -1, name: "" },
      gender: { id: -1, name: "" },
    },
  });

  useEffect(() => {
    if (params.edit) {
      void refetchJob();
    }
  }, [params.edit, refetchJob]);

  useEffect(() => {
    if (job) {
      setValue("country", job.country);
      setValue("categories", job.categories);
      setValue("gender", job.gender || { id: -1, name: "" });
      setValue("minFollowers", job.minFollowers);
      setValue("numberOfInfluencers", job.numberOfInfluencers);
      setValue("jobDetails", job.JobDetails);
      setValue("jobSummary", job.jobSummary);
      setValue("jobPrice", helper.calculerMonetaryValue(job.price));
      setValue("platform", job.socialMedia);
      setIsPublished(job.published);
      setContentTypesList(job.contentTypeWithQuantity);
    }
  }, [job, setValue]);

  const { data: platforms } = api.allRoutes.getAllSocialMedia.useQuery();
  const { data: categories } = api.allRoutes.getAllCategories.useQuery();
  const { data: genders } = api.allRoutes.getAllGenders.useQuery();
  const { data: countries } = api.allRoutes.getAllCountries.useQuery();

  const { mutate: jobCreation, isLoading: isLoadingCreate } =
    api.jobs.createJob.useMutation({
      onSuccess: (job) => {
        void router.push(`/manage-jobs/${job.id}`);
        void ctx.jobs.getAllUserJobs.invalidate().then(() => {
          toast.success(t("components.myJobDropDown.jobCreated"), {
            position: "bottom-left",
          });
        });
      },
    });

  const { mutate: jobUpdate, isLoading: isLoadingUpdate } =
    api.jobs.updateJob.useMutation({
      onSuccess: (job) => {
        void router.push(`/manage-jobs/${job.id}`);
        void ctx.jobs.getJob.invalidate();
        void ctx.jobs.getApplicants.invalidate();
        void ctx.jobs.getAllUserJobs.invalidate().then(() => {
          toast.success(t("components.myJobDropDown.jobUpdated"), {
            position: "bottom-left",
          });
        });
      },
    });

  const submitRequest = handleSubmit((data) => {
    if (
      isDirty ||
      prevContentTypes !== contentTypesList ||
      prevGender !== data.gender
    ) {
      const payload = {
        jobId: params.jobId || -1,
        jobSummary: data.jobSummary,
        jobDetails: data.jobDetails,
        socialMediaId: data.platform.id,
        contentTypes: contentTypesList.map((item) => {
          return {
            contentTypeId: item.contentType.id,
            amount: item.amount,
          };
        }),
        categories: data.categories.map((category) => {
          return category.id;
        }),
        price: data.jobPrice,
        numberOfInfluencers: data.numberOfInfluencers,
        countryId: data.country.id,
        minFollowers: data.minFollowers,
        genderId: data.gender.id,
        published: isPublished,
      };

      if (params.edit) {
        jobUpdate(payload);
      } else {
        jobCreation(payload);
      }
    } else {
      reset();
    }
  });

  const renderJobSummaryInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.jobSummary")}
          </div>
          <div className="flex w-full flex-col">
            <input
              {...register("jobSummary", { maxLength: 50 })}
              required
              type="text"
              className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.manageJobs.jobSummaryPlaceholder")}
              autoComplete="off"
            />
            {errors.jobSummary && errors.jobSummary.type === "maxLength" && (
              <div className="px-4 py-1 text-red-600">
                {t("pages.manageJobs.errorWarning", { count: 50 })}
              </div>
            )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderJobDetailsInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.jobDetails")}
          </div>
          <div className="flex w-full flex-col">
            <textarea
              {...register("jobDetails", { maxLength: 2200 })}
              required
              className="flex min-h-[230px]  cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.manageJobs.detailsPlaceholder")}
              autoComplete="off"
            />
            {errors.jobDetails && errors.jobDetails.type === "maxLength" && (
              <div className="px-4 py-1 text-red-600">
                {t("pages.manageJobs.errorWarning", {
                  count: 2200,
                })}
              </div>
            )}
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderPlatformInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.platformTitle")}
          </div>
          <Controller
            name="platform"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="platform"
                  placeholder={t("pages.manageJobs.platformPlaceholder")}
                  options={platforms?.map((platform) => {
                    return { id: platform.id, name: platform.name };
                  })}
                  value={value}
                  handleOptionSelect={(value) => {
                    onChange(value);
                    setContentTypesList([
                      {
                        contentType: { id: -1, name: "" },
                        amount: 0,
                      },
                    ]);
                  }}
                  required={true}
                />
              );
            }}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderContentTypeInput = () => {
    const platform = watch("platform");

    if (!platform || platform.id === -1) {
      return null;
    }

    const selectPlatform = platforms?.filter(
      (platform) => platform.id === watch("platform").id
    );

    const allContentTypesSelected =
      selectPlatform?.[0]?.contentTypes.length === contentTypesList.length;

    if (selectPlatform?.[0]) {
      return (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="text-xl font-medium">
                {t("pages.manageJobs.contentTypesTitle")}
              </div>
              {!allContentTypesSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-sm cursor-pointer"
                    onClick={() => addContentTypeInput()}
                  />
                </div>
              )}
            </div>
            {contentTypesList.map((contentType, index) => {
              // Create a Set to store selected content IDs, excluding the current one
              const selectedContentIds = new Set(
                contentTypesList.map((contentType, i) => {
                  // If the current content type is not the one being processed, store its ID
                  if (i !== index) return contentType.contentType.id;
                })
              );

              // Filter available content types based on selected content IDs
              const availableTypes: Option[] =
                selectPlatform?.[0]?.contentTypes.filter(
                  (contentType) => !selectedContentIds.has(contentType.id)
                ) ?? [];

              // Render the content type with a quantity input field
              return renderContentTypeWithQuantityInput(
                index,
                availableTypes || []
              );
            })}
          </div>
          <div className="w-full border-[1px] border-white1" />
        </>
      );
    } else {
      return null;
    }
  };

  const renderContentTypeWithQuantityInput = (
    index: number,
    types: Option[]
  ) => {
    return (
      <div
        className="flex w-full flex-1 items-center gap-2"
        key={`contentTypeWithQuantity${index}`}
      >
        {contentTypesList.length > 1 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon
              icon={faSubtract}
              className="fa-sm cursor-pointer"
              onClick={() => removeContentTypeInput(index)}
            />
          </div>
        )}
        <div className="flex flex-1 items-center gap-2">
          <CustomSelect
            name="contentType"
            placeholder={t("pages.manageJobs.contentTypePlaceholder")}
            options={types.map((type) => {
              return {
                id: type.id,
                name: t(`general.contentTypes.${type.name}`),
              };
            })}
            value={
              contentTypesList?.[index]?.contentType || { id: -1, name: "" }
            }
            handleOptionSelect={(value: Option) => {
              handleContentTypeChange(index, value);
            }}
            required={true}
          />

          <input
            type="number"
            required
            className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
            placeholder={t("pages.manageJobs.howMany")}
            max="10"
            min="1"
            value={contentTypesList[index]?.amount || ""}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) =>
              handleQuantityChange(index, e.target.valueAsNumber)
            }
          />
        </div>
      </div>
    );
  };

  const handleContentTypeChange = (index: number, value: Option) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, contentType: value } : contentType
      )
    );
  };

  const handleQuantityChange = (index: number, value: number) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.map((contentType, i) =>
        i === index ? { ...contentType, amount: value } : contentType
      )
    );
  };

  const addContentTypeInput = () => {
    setContentTypesList((prevContentTypes) => [
      ...prevContentTypes,
      { contentType: { id: -1, name: "" }, amount: 0 },
    ]);
  };

  const removeContentTypeInput = (index: number) => {
    setContentTypesList((prevContentTypes) =>
      prevContentTypes.filter((_, i) => i !== index)
    );
  };

  const renderCategoriesInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.jobCategories")}
          </div>
          <Controller
            name="categories"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomMultiSelect
                  name="categories"
                  placeholder={t("pages.manageJobs.categoriesPlaceholder")}
                  options={categories?.map((category) => {
                    return {
                      id: category.id,
                      name: t(`general.categories.${category.name}`),
                    };
                  })}
                  handleOptionSelect={onChange}
                  selectedOptions={value}
                  clearSelection={() => setValue("categories", [])}
                  borderType="normal"
                  required={true}
                />
              );
            }}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderJobPriceInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.jobPriceTitle")}
          </div>
          <input
            {...register("jobPrice", { valueAsNumber: true })}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.manageJobs.pricePlaceholder")}
            autoComplete="off"
            min="0"
            max="1000000000"
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderNumberOfInfluencersInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.numberOfInfluencers")}
          </div>
          <input
            {...register("numberOfInfluencers", { valueAsNumber: true })}
            required
            type="number"
            className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.manageJobs.numberOfInfluencersPlaceholder")}
            autoComplete="off"
            min="1"
            max="1000000"
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderLocationInputs = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.influencerLocation")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <CustomSelect
                    register={register}
                    name="country"
                    placeholder={t("pages.manageJobs.country")}
                    options={
                      countries && countries.length > 0
                        ? countries?.map((country) => {
                            return {
                              id: country.id,
                              name: country.name,
                            };
                          })
                        : []
                    }
                    value={value}
                    handleOptionSelect={onChange}
                    required={true}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderFollowersInput = () => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="text-xl font-medium">
            {t("pages.manageJobs.influencerFollowers")}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-11">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-gray2">
                {t("pages.manageJobs.minimum")}
              </label>
              <input
                {...register("minFollowers", { valueAsNumber: true })}
                type="number"
                required
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2 focus:border-black focus:outline-none"
                placeholder={t("pages.manageJobs.minFollowers")}
                autoComplete="off"
                max="1000000000"
                min="0"
                onWheel={(e) => e.currentTarget.blur()}
              />
              {errors.minFollowers ? (
                <div className="text-sm text-influencer">
                  {errors.minFollowers.message}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderGenderInput = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          {t("pages.manageJobs.influencerGender")}
        </div>
        <div className="flex flex-wrap justify-start gap-4 text-sm sm:text-base">
          <div
            key={-1}
            className={
              watch("gender").id === -1
                ? "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white sm:w-24"
                : "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center sm:w-24"
            }
            onClick={() => setValue("gender", { id: -1, name: "" })}
          >
            {t(`pages.manageJobs.any`)}
          </div>
          {genders?.map((gender) => {
            return (
              <div
                key={gender.id}
                className={
                  watch("gender").id === gender.id
                    ? "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 bg-influencer-green p-2 text-center text-white sm:w-24"
                    : "w-18 flex cursor-pointer justify-center rounded-2xl border-[1px] border-gray3 p-2 text-center sm:w-24"
                }
                onClick={() => setValue("gender", gender)}
              >
                {t(`pages.manageJobs.${gender.name}`)}
              </div>
            );
          })}
        </div>
        <div className="w-full border-[1px] border-white1" />
      </div>
    );
  };

  const renderPublishedToggled = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="text-xl font-medium">
            {t(`pages.manageJobs.publishJob`)}
          </div>
          <ToolTip content={t(`pages.manageJobs.publishJobToolTip`)} />
        </div>
        <div>
          <label className="relative mr-5 inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              readOnly
              defaultChecked={isPublished}
            />
            <div
              onClick={() => {
                setIsPublished(!isPublished);
              }}
              className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light"
            />
            <span className="ml-2 font-medium text-gray-900">
              {isPublished
                ? t(`pages.manageJobs.publishJobToggleLabelPublish`)
                : t(`pages.manageJobs.publishJobToggleLabelNot`)}
            </span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <form
      id="form-createModal"
      className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4"
      onSubmit={submitRequest}
    >
      <div className="flex flex-1 justify-center font-playfair text-5xl font-semibold">
        {params.edit
          ? t("pages.manageJobs.updateJob")
          : t("pages.manageJobs.createJob")}
      </div>
      {isLoadingJob && params.edit ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {renderJobSummaryInput()}
          {renderJobDetailsInput()}
          {renderPlatformInput()}
          {renderContentTypeInput()}
          {renderCategoriesInput()}
          {renderJobPriceInput()}
          {renderNumberOfInfluencersInput()}
          {renderLocationInputs()}
          {renderFollowersInput()}
          {renderGenderInput()}
          {renderPublishedToggled()}
          <Button
            type="submit"
            title={t("pages.manageJobs.saveJob")}
            level="primary"
            form="form-createModal"
            isLoading={isLoadingCreate || isLoadingUpdate}
          />
        </>
      )}
    </form>
  );
};

export { CreateJobPage };
