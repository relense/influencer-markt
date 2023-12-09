import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCircleCheck,
  faEllipsis,
  faList,
  faPlus,
  faSubtract,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { helper, useOutsideClick } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ProfileCard } from "../../components/ProfileCard";

import { Button } from "../../components/Button";
import { useRouter } from "next/router";
import Link from "next/link";
import type {
  JobWithAllData,
  Option,
  UserSocialMedia,
} from "../../utils/globalTypes";
import { toast } from "react-hot-toast";
import { ProfileRow } from "../../components/ProfileRow";
import { MyJobDropdown } from "../../components/MyJobDropdown";
import { MyJobsActionConfirmationModal } from "../../components/MyJobsActionConfirmationModal";
import dayjs from "dayjs";
import { ToolTip } from "../../components/ToolTip";

type ApplicantsProfile = {
  id: string;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: Option;
  country: { id: number; name: string; countryTax: number };
  username: string;
  bookmarked?: boolean;
  favoritedBy?: string[];
  activeJobs?: number;
  orderId?: string;
};

const ManageJobDetailsPage = (params: {
  jobId: string;
  loggedInProfileId: string;
  isBrand: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef(null);
  const router = useRouter();
  const ctx = api.useUtils();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);
  const [isAcceptedApplicantsOpen, setIsAcceptedApplicantsOpen] =
    useState<boolean>(true);
  const [isRejectedApplicantsOpen, setIsRejectedApplicantsOpen] =
    useState<boolean>(false);
  const [isSentJobApplicantsOpen, setIsSentJobApplicantsOpen] =
    useState<boolean>(true);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [isApplicantsOpen, setIsApplicantsOpen] = useState<boolean>(true);
  const [warningModalType, setWarningModalType] = useState<
    "archive" | "delete" | "publish"
  >("archive");
  const [warningModalJobId, setWarningModalJobId] = useState<string>("");
  const [applicants, setApplicants] = useState<ApplicantsProfile[]>([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState<
    ApplicantsProfile[]
  >([]);
  const [rejectedApplicants, setRejectedApplicants] = useState<
    ApplicantsProfile[]
  >([]);
  const [sentApplicants, setSentApplicants] = useState<ApplicantsProfile[]>([]);
  const [job, setJob] = useState<JobWithAllData | undefined>(undefined);
  const [listView, setListView] = useState<boolean>(true);
  const [dateOfDelivery, setDateOfDelivery] = useState<string>("");

  const {
    data: jobData,
    isLoading,
    isRefetching: isRefetchingJob,
  } = api.jobs.getJob.useQuery(
    {
      jobId: params.jobId,
    },
    {
      cacheTime: 0,
    }
  );

  const { data: jobApplicants } = api.jobs.getApplicants.useQuery(
    {
      jobId: params.jobId,
    },
    {
      cacheTime: 0,
    }
  );

  const { data: jobAcceptedApplicants } =
    api.jobs.getAcceptedApplicants.useQuery(
      {
        jobId: params.jobId,
      },
      {
        cacheTime: 0,
      }
    );

  const { data: jobRejectedApplicants } =
    api.jobs.getRejectedApplicants.useQuery(
      {
        jobId: params.jobId,
      },
      {
        cacheTime: 0,
      }
    );

  const { data: jobSentApplicants } = api.jobs.getSentOrderApplicants.useQuery(
    {
      jobId: params.jobId,
    },
    {
      cacheTime: 0,
    }
  );

  const { mutate: acceptedApplicant } = api.jobs.acceptedApplicant.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: rejectApplication } = api.jobs.rejectApplicant.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: removeApplicantFromAccepted } =
    api.jobs.removeApplicantFromAccepted.useMutation({
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: removeApplicantFromRejected } =
    api.jobs.removeApplicantFromRejected.useMutation({
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const {
    mutate: updateApplicantToSentList,
    isLoading: isLoadingUpdateApplicantToSentList,
  } = api.jobs.updateApplicantToSentList.useMutation({
    onSuccess: () => {
      void ctx.jobs.getJob.invalidate();
      void ctx.jobs.getAcceptedApplicants.invalidate();
      void ctx.jobs.getSentOrderApplicants.invalidate();
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: startJob, isLoading: isLoadingStartJob } =
    api.jobs.startJob.useMutation({
      onSuccess: () => {
        void ctx.jobs.getJob.invalidate();
        void ctx.jobs.getAcceptedApplicants.invalidate();
        void ctx.jobs.getSentOrderApplicants.invalidate();
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: publishJobMutation } = api.jobs.publishJob.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: archiveJobMutation } = api.jobs.archiveJob.useMutation({
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: deleteJobMutation } = api.jobs.deleteJob.useMutation({
    onSuccess: () => {
      toast.success(t("components.myJobDropDown.jobDeleted"), {
        position: "bottom-left",
      });
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: duplicateJobMutation } = api.jobs.duplicateJob.useMutation({
    onSuccess: () => {
      toast.success(t("components.myJobDropDown.jobDuplicated"), {
        position: "bottom-left",
      });
    },
    onError: () => {
      toast.error(t("general.error.generalErrorMessage"), {
        position: "bottom-left",
      });
    },
  });

  const { mutate: createOrder, isLoading: isLoadingCreateOrder } =
    api.orders.createOrderWithJob.useMutation({
      onSuccess: (order) => {
        if (order && order.influencerId) {
          createNotification({
            entityId: order.id,
            entityAction: "awaitingOrderReply",
            senderId: order?.buyerId || "",
            notifierId: order.influencerId,
          });

          updateApplicantToSentList({
            jobId: params.jobId,
            profileId: order?.influencerId,
          });
        }
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: createNotification } =
    api.notifications.createNotification.useMutation({
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  useEffect(() => {
    if (jobApplicants) {
      const newApplicants = jobApplicants.applicants.map((applicant) => {
        let isFavorited = false;

        if (params.loggedInProfileId) {
          isFavorited = !!applicant.favoriteBy.find(
            (applicant) => params.loggedInProfileId === applicant.id
          );
        }

        return {
          id: applicant.id,
          profilePicture: applicant.profilePicture,
          socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
            return {
              id: userSocialMedia.id,
              handler: userSocialMedia.handler,
              userSocialMediaFollowers:
                userSocialMedia.socialMediaFollowers || { id: -1, name: "" },
              url: userSocialMedia.url,
              socialMediaName: userSocialMedia.socialMedia?.name || "",
              socialMediaId: userSocialMedia.socialMedia?.id || -1,
              mainSocialMedia: userSocialMedia.mainSocialMedia,
            };
          }),
          name: applicant.name,
          about: applicant.about,
          city: {
            id: applicant.city?.id || -1,
            name: applicant.city?.name || "",
          },
          country: {
            id: applicant.country?.id || -1,
            name: applicant.country?.name || "",
            countryTax: applicant.country?.countryTax || -1,
          },
          username: applicant.user?.username || "",
          bookmarked: isFavorited,
          favoritedBy: applicant.favoriteBy.map((favorite) => {
            return favorite.id;
          }),
        };
      });

      setApplicants(newApplicants);
    }
  }, [jobApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (jobAcceptedApplicants) {
      const newApplicants = jobAcceptedApplicants.acceptedApplicants.map(
        (applicant) => {
          let isFavorited = false;

          if (params.loggedInProfileId) {
            isFavorited = !!applicant.favoriteBy.find(
              (applicant) => params.loggedInProfileId === applicant.id
            );
          }

          return {
            id: applicant.id,
            profilePicture: applicant.profilePicture,
            socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
              return {
                id: userSocialMedia.id,
                handler: userSocialMedia.handler,
                userSocialMediaFollowers:
                  userSocialMedia.socialMediaFollowers || { id: -1, name: "" },
                url: userSocialMedia.url,
                socialMediaName: userSocialMedia.socialMedia?.name || "",
                socialMediaId: userSocialMedia.socialMedia?.id || -1,
                mainSocialMedia: userSocialMedia.mainSocialMedia,
              };
            }),
            name: applicant.name,
            about: applicant.about,
            city: {
              id: applicant.city?.id || -1,
              name: applicant.city?.name || "",
            },
            country: {
              id: applicant.country?.id || -1,
              name: applicant.country?.name || "",
              countryTax: applicant.country?.countryTax || -1,
            },
            username: applicant.user?.username || "",
            bookmarked: isFavorited,
            favoritedBy: applicant.favoriteBy.map((favorite) => {
              return favorite.id;
            }),
          };
        }
      );

      setAcceptedApplicants(newApplicants);
    }
  }, [jobAcceptedApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (jobRejectedApplicants) {
      const newApplicants = jobRejectedApplicants.rejectedApplicants.map(
        (applicant) => {
          let isFavorited = false;

          if (params.loggedInProfileId) {
            isFavorited = !!applicant.favoriteBy.find(
              (applicant) => params.loggedInProfileId === applicant.id
            );
          }

          return {
            id: applicant.id,
            profilePicture: applicant.profilePicture,
            socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
              return {
                id: userSocialMedia.id,
                handler: userSocialMedia.handler,
                userSocialMediaFollowers:
                  userSocialMedia.socialMediaFollowers || { id: -1, name: "" },
                url: userSocialMedia.url,
                socialMediaName: userSocialMedia.socialMedia?.name || "",
                socialMediaId: userSocialMedia.socialMedia?.id || -1,
                mainSocialMedia: userSocialMedia.mainSocialMedia,
              };
            }),
            name: applicant.name,
            about: applicant.about,
            city: {
              id: applicant.city?.id || -1,
              name: applicant.city?.name || "",
            },
            country: {
              id: applicant.country?.id || -1,
              name: applicant.country?.name || "",
              countryTax: applicant.country?.countryTax || -1,
            },
            username: applicant.user?.username || "",
            bookmarked: isFavorited,
            favoritedBy: applicant.favoriteBy.map((favorite) => {
              return favorite.id;
            }),
          };
        }
      );

      setRejectedApplicants(newApplicants);
    }
  }, [jobRejectedApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (jobSentApplicants) {
      const newApplicants = jobSentApplicants.sentApplicants.map(
        (applicant) => {
          let isFavorited = false;

          if (params.loggedInProfileId) {
            isFavorited = !!applicant.favoriteBy.find(
              (applicant) => params.loggedInProfileId === applicant.id
            );
          }

          return {
            id: applicant.id,
            profilePicture: applicant.profilePicture,
            socialMedia: applicant.userSocialMedia.map((userSocialMedia) => {
              return {
                id: userSocialMedia.id,
                handler: userSocialMedia.handler,
                userSocialMediaFollowers:
                  userSocialMedia.socialMediaFollowers || { id: -1, name: "" },
                url: userSocialMedia.url,
                socialMediaName: userSocialMedia.socialMedia?.name || "",
                socialMediaId: userSocialMedia.socialMedia?.id || -1,
                mainSocialMedia: userSocialMedia.mainSocialMedia,
              };
            }),
            name: applicant.name,
            about: applicant.about,
            city: {
              id: applicant.city?.id || -1,
              name: applicant.city?.name || "",
            },
            country: {
              id: applicant.country?.id || -1,
              name: applicant.country?.name || "",
              countryTax: applicant.country?.countryTax || -1,
            },
            username: applicant.user?.username || "",
            bookmarked: isFavorited,
            favoritedBy: applicant.favoriteBy.map((favorite) => {
              return favorite.id;
            }),
            orderId: applicant.influencer[0]?.id,
          };
        }
      );

      setSentApplicants(newApplicants);
    }
  }, [jobSentApplicants, params.loggedInProfileId]);

  useEffect(() => {
    if (jobData) {
      setJob(jobData);
    }
  }, [jobData]);

  useOutsideClick(() => {
    if (isDropdownOpen === false) return;

    setIsDropdownOpen(!isDropdownOpen);
  }, dropdownRef);

  const submitOrder = (applicant: ApplicantsProfile) => {
    if (job) {
      createOrder({
        influencerId: applicant.id,
        orderDetails: job.JobDetails,
        orderPrice: job.price,
        orderValuePacks: job.contentTypeWithQuantity.map((valuePack) => {
          return {
            amount: valuePack.amount,
            price: 0,
            contentTypeId: valuePack.contentType.id,
          };
        }),
        platformId: job.socialMediaId,
        jobId: job.id,
        dateOfDelivery: dayjs(dateOfDelivery).toDate(),
      });
    }
  };

  const publishJob = (jobId: string) => {
    if (job) {
      const newJob = job;
      newJob.published = true;

      setJob(newJob);

      void publishJobMutation({ jobId: jobId });
    }
  };

  const archiveJob = (jobId: string) => {
    if (job) {
      const newJob = job;
      newJob.jobStatus = { id: 3, name: "closed" };

      setJob(newJob);
      void archiveJobMutation({ jobId: jobId });
    }
  };

  const deleteJob = (jobId: string) => {
    void router.push("/manage-jobs");
    void deleteJobMutation({ jobId: jobId });
  };

  const onAcceptedApplicant = (profileId: string) => {
    const newApplicantsArray = [...applicants];
    const newAcceptedApplicantsArray = [...acceptedApplicants];

    const savedProfileIndex = newApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (savedProfileIndex !== -1) {
      const savedProfile = newApplicantsArray.splice(savedProfileIndex, 1)[0];
      if (savedProfile) {
        newAcceptedApplicantsArray.push(savedProfile);
      }

      setApplicants(newApplicantsArray);
      setAcceptedApplicants(newAcceptedApplicantsArray);

      acceptedApplicant({
        jobId: params.jobId,
        profileId: profileId,
      });
    }
  };

  const onRejectApplicant = (profileId: string) => {
    const newApplicantsArray = [...applicants];
    const newRejectApplicantsArray = [...rejectedApplicants];

    const rejectedProfileIndex = newApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (rejectedProfileIndex !== -1) {
      const rejectedProfile = newApplicantsArray.splice(
        rejectedProfileIndex,
        1
      )[0];

      if (rejectedProfile) {
        newRejectApplicantsArray.push(rejectedProfile);
      }

      setApplicants(newApplicantsArray);
      setRejectedApplicants(newRejectApplicantsArray);

      rejectApplication({
        jobId: params.jobId,
        profileId: profileId,
      });
    }
  };

  const onRemoveFromAccepted = (profileId: string) => {
    const newApplicantsArray = [...applicants];
    const newAcceptedApplicantsArray = [...acceptedApplicants];

    const savedProfileIndex = newAcceptedApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (savedProfileIndex !== -1) {
      const savedProfile = newAcceptedApplicantsArray.splice(
        savedProfileIndex,
        1
      )[0];
      if (savedProfile) {
        newApplicantsArray.push(savedProfile);
      }

      setApplicants(newApplicantsArray);
      setAcceptedApplicants(newAcceptedApplicantsArray);

      removeApplicantFromAccepted({
        jobId: params.jobId,
        profileId: profileId,
      });
    }
  };

  const onRemoveFromRejected = (profileId: string) => {
    const newApplicantsArray = [...applicants];
    const newRejectApplicantsArray = [...rejectedApplicants];

    const profileIndex = newRejectApplicantsArray.findIndex(
      (applicant) => applicant.id === profileId
    );

    if (profileIndex !== -1) {
      const rejectedProfile = newRejectApplicantsArray.splice(
        profileIndex,
        1
      )[0];

      if (rejectedProfile) {
        newApplicantsArray.push(rejectedProfile);
      }

      setApplicants(newApplicantsArray);
      setRejectedApplicants(newRejectApplicantsArray);

      removeApplicantFromRejected({
        jobId: params.jobId,
        profileId: profileId,
      });
    }
  };

  const openWarningModal = (
    type: "archive" | "delete" | "publish",
    jobId: string
  ) => {
    setIsWarningModalOpen(true);
    setWarningModalType(type);
    setWarningModalJobId(jobId);
  };

  const optionsMenu = () => {
    if (job) {
      return (
        <div className="z-5 group absolute right-0 top-0" ref={dropdownRef}>
          <FontAwesomeIcon
            icon={faEllipsis}
            className="fa-xl cursor-pointer text-gray2 hover:text-influencer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="flex lg:hidden">
              {
                <MyJobDropdown
                  job={job}
                  closeDropDown={() => setIsDropdownOpen(false)}
                  openEditJobModal={() =>
                    void router.push({
                      pathname: "/manage-jobs/create-job",
                      query: {
                        jobId: job.id,
                        edit: true,
                      },
                    })
                  }
                  openWarningModal={openWarningModal}
                  duplicateJob={() => duplicateJobMutation({ jobId: job.id })}
                />
              }
            </div>
          )}
          <div className="hidden group-hover:flex">
            {
              <MyJobDropdown
                job={job}
                closeDropDown={() => setIsDropdownOpen(false)}
                openEditJobModal={() =>
                  void router.push({
                    pathname: "/manage-jobs/create-job",
                    query: {
                      jobId: job.id,
                      edit: true,
                    },
                  })
                }
                openWarningModal={openWarningModal}
                duplicateJob={() => duplicateJobMutation({ jobId: job.id })}
              />
            }
          </div>
        </div>
      );
    }
  };

  const renderJobHeader = () => {
    if (job) {
      return (
        <>
          {job.published ? (
            <Link
              href={`/jobs/${job.id}`}
              className="line-clamp-2 text-xl font-semibold hover:underline xs:w-3/4"
            >
              {job.jobSummary}
            </Link>
          ) : (
            <div className="line-clamp-2 text-xl font-semibold xs:w-3/4">
              {job.jobSummary}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="text-gray2">{job.country.name}</div>
              <div className="h-1 w-1 rounded-full bg-black"></div>
              <div className="text-gray2">
                {helper.formatDate(job.createdAt, i18n.language)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-influencer">
                {job.published
                  ? t("pages.manageJobs.published")
                  : t("pages.manageJobs.unpublished")}
              </div>
              <div className="h-1 w-1 rounded-full bg-black"></div>
              <div className="font-semibold text-influencer">
                {job.jobStatus.id === 1 && t("pages.manageJobs.open")}
                {job.jobStatus.id === 2 && t("pages.manageJobs.progress")}
                {job.jobStatus.id === 3 && t("pages.manageJobs.archived")}
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const renderSearchRequirements = () => {
    if (job) {
      return (
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-2">
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">
              {job.socialMedia.name}
            </div>

            <div className="flex gap-2">
              {job.contentTypeWithQuantity.map((contentType, index) => {
                return (
                  <div key={contentType.id} className="flex items-center gap-2">
                    <div>
                      {t(
                        `general.contentTypesPlural.${contentType.contentType.name}`,
                        { count: contentType.amount }
                      )}
                      {job.contentTypeWithQuantity.length - 1 !== index && ", "}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
          <div className="flex items-center gap-2">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.gender")}
            </div>
            <div>{job.gender?.name || t("pages.manageJobs.any")}</div>
          </div>
          <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
          <div className="flex items-center gap-2">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.followers")}
            </div>
            <div>{job.userSocialMediaFollowers?.name} </div>
          </div>
          <div className="hidden h-1 w-1 rounded-full bg-black sm:flex"></div>
          <div className="flex items-center gap-2">
            <div className="font-semibold text-influencer">
              {t("pages.manageJobs.basePrice")}
            </div>
            <div>{helper.calculerMonetaryValue(job.price)}</div>
            <ToolTip content={t("pages.manageJobs.baseValueDisclaimer")} />
          </div>
        </div>
      );
    }
  };

  const renderDescription = () => {
    if (job) {
      return (
        <div>
          <div>
            <span className="pr-2 font-semibold text-influencer">
              {t("pages.manageJobs.jobDescription")}
            </span>
            <div className="whitespace-pre-line">{job.JobDetails}</div>
          </div>
        </div>
      );
    }
  };

  const renderCategories = () => {
    if (job) {
      return (
        <div>
          <div className="flex flex-wrap items-center">
            <div className="pr-2 font-semibold text-influencer">
              {t("pages.manageJobs.categories")}
            </div>
            {job.categories.map((category, index) => {
              return (
                <div key={category.id} className="pr-2">
                  {t(`general.categories.${category.name}`)}
                  {index !== job.categories.length - 1 && ","}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderInterestedProfiles = () => {
    if (job && jobApplicants && jobAcceptedApplicants) {
      return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {job.jobStatusId === 1 && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="fa-xl cursor-pointer text-influencer"
              />
              <div className="font-semibold">
                {t("pages.manageJobs.applicants", {
                  count: applicants.length,
                })}
              </div>
            </div>
          )}
          {job.jobStatusId !== 3 && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="fa-xl cursor-pointer text-influencer"
              />
              <div className="font-semibold">
                {t("pages.manageJobs.openings", {
                  acceptedAplicants:
                    jobAcceptedApplicants?.acceptedApplicants.length,
                  count: job.numberOfInfluencers,
                })}
              </div>
            </div>
          )}
          {acceptedApplicants.length > 0 && job.jobStatus.id === 1 && (
            <Button
              title={t("pages.manageJobs.initiateJob")}
              level="terciary"
              isLoading={isLoadingStartJob || isRefetchingJob}
              onClick={() =>
                startJob({
                  jobId: job.id,
                })
              }
            />
          )}
          {job.jobStatus.id === 2 && (
            <Button
              title={t("pages.manageJobs.archiveJob")}
              level="terciary"
              onClick={() => openWarningModal("archive", job.id)}
            />
          )}
        </div>
      );
    }
  };

  const renderJobDetails = () => {
    if (job) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            <div className="text-2xl font-bold">
              {t("pages.manageJobs.jobDetails")}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isDetailsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isDetailsOpen && (
            <div className="relative">
              <div className="flex flex-col gap-4">
                {renderJobHeader()}
                {renderSearchRequirements()}
                {renderCategories()}
                {renderDescription()}
                {renderInterestedProfiles()}
              </div>
              {optionsMenu()}
            </div>
          )}
        </div>
      );
    }
  };

  const renderAcceptedApplicantCard = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
            isLoggedInProfileBrand={params.isBrand}
          />

          {job.jobStatus.id === 1 && (
            <Button
              title={t("pages.manageJobs.removeButton")}
              level="secondary"
              size="large"
              onClick={() => onRemoveFromAccepted(applicant.id)}
            />
          )}
          {job.jobStatus.id === 2 && (
            <div className="flex flex-col justify-center gap-4">
              {renderDateOfDelivery()}
              <Button
                title={t("pages.manageJobs.sendOrderRequest")}
                level="terciary"
                size="large"
                onClick={() => submitOrder(applicant)}
                isLoading={
                  isLoadingCreateOrder || isLoadingUpdateApplicantToSentList
                }
                disabled={
                  isLoadingCreateOrder ||
                  isLoadingUpdateApplicantToSentList ||
                  !dateOfDelivery
                }
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderAcceptedApplicantRow = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
          />
          {job.jobStatus.id === 1 && (
            <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
              <Button
                title={t("pages.manageJobs.removeButton")}
                level="secondary"
                size="large"
                onClick={() => onRemoveFromAccepted(applicant.id)}
              />
            </div>
          )}
          {job.jobStatus.id === 2 && (
            <div className="flex flex-col justify-center gap-4">
              {renderDateOfDelivery()}
              <Button
                title={t("pages.manageJobs.sendOrderRequest")}
                level="terciary"
                size="large"
                onClick={() => submitOrder(applicant)}
                isLoading={
                  isLoadingCreateOrder || isLoadingUpdateApplicantToSentList
                }
                disabled={
                  isLoadingCreateOrder ||
                  isLoadingUpdateApplicantToSentList ||
                  !dateOfDelivery
                }
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderAcceptedApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

    if (job) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() =>
              setIsAcceptedApplicantsOpen(!isAcceptedApplicantsOpen)
            }
          >
            <div className="text-2xl font-bold">
              {t("pages.manageJobs.acceptedAplicants", {
                count: acceptedApplicants.length,
              })}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isAcceptedApplicantsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isAcceptedApplicantsOpen && jobAcceptedApplicants && (
            <div className={applicantsContainerClass}>
              {acceptedApplicants.map((applicant) => {
                return listView
                  ? renderAcceptedApplicantRow(applicant)
                  : renderAcceptedApplicantCard(applicant);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  const renderApplicantCard = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
            isLoggedInProfileBrand={params.isBrand}
          />
          {acceptedApplicants.length < job.numberOfInfluencers && (
            <div className="flex justify-around gap-4">
              <Button
                title={t("pages.manageJobs.acceptButton")}
                level="terciary"
                size="large"
                onClick={() => onAcceptedApplicant(applicant.id)}
              />
              <Button
                title={t("pages.manageJobs.rejectButton")}
                level="secondary"
                size="large"
                onClick={() => onRejectApplicant(applicant.id)}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderApplicantRow = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
          />
          {acceptedApplicants.length < job.numberOfInfluencers && (
            <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
              <Button
                title={t("pages.manageJobs.acceptButton")}
                level="terciary"
                size="large"
                onClick={() => onAcceptedApplicant(applicant.id)}
              />
              <Button
                title={t("pages.manageJobs.rejectButton")}
                level="secondary"
                size="large"
                onClick={() => onRejectApplicant(applicant.id)}
              />
            </div>
          )}
        </div>
      );
    }
  };

  const renderApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

    if (job) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsApplicantsOpen(!isApplicantsOpen)}
          >
            <div className="text-2xl font-bold">
              {t("pages.manageJobs.applicants", { count: applicants.length })}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isApplicantsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isApplicantsOpen && jobApplicants && jobAcceptedApplicants && (
            <div className={applicantsContainerClass}>
              {applicants.map((applicant) => {
                return listView
                  ? renderApplicantRow(applicant)
                  : renderApplicantCard(applicant);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  const renderRejectApplicantCard = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
            isLoggedInProfileBrand={params.isBrand}
          />

          <Button
            title={t("pages.manageJobs.removeButton")}
            level="secondary"
            size="large"
            onClick={() => onRemoveFromRejected(applicant.id)}
          />
        </div>
      );
    }
  };

  const renderRejectApplicantRow = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
          />
          <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
            <Button
              title={t("pages.manageJobs.removeButton")}
              level="secondary"
              size="large"
              onClick={() => onRemoveFromRejected(applicant.id)}
            />
          </div>
        </div>
      );
    }
  };

  const renderRejectedApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

    if (job) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() =>
              setIsRejectedApplicantsOpen(!isRejectedApplicantsOpen)
            }
          >
            <div className="text-2xl font-bold">
              {t("pages.manageJobs.rejectedApplicants", {
                count: rejectedApplicants.length,
              })}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isRejectedApplicantsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isRejectedApplicantsOpen && rejectedApplicants && (
            <div className={applicantsContainerClass}>
              {rejectedApplicants.map((applicant) => {
                return listView
                  ? renderRejectApplicantRow(applicant)
                  : renderRejectApplicantCard(applicant);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  const renderDateOfDelivery = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="select-none text-xl font-medium">
          {t("pages.startOrder.dateDelivery")}
        </div>
        <div>
          <input
            type="date"
            className="w-full rounded-xl border-[1px] p-2 focus:border-[1px] focus:border-black focus:outline-none"
            min={dayjs(Date.now()).format("YYYY-MM-DD")}
            onChange={(e) => setDateOfDelivery(e.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderSentJobApplicantCard = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4">
          <ProfileCard
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
            loggedInProfileId={params.loggedInProfileId}
            isLoggedInProfileBrand={params.isBrand}
          />
          <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
            <Button
              title={t("pages.manageJobs.viewOrder")}
              level="terciary"
              size="large"
              onClick={() =>
                void router.push(`/orders/${applicant?.orderId || -1}`)
              }
            />
          </div>
        </div>
      );
    }
  };

  const renderSentJobApplicantRow = (applicant: ApplicantsProfile) => {
    if (job) {
      return (
        <div key={applicant.id} className="flex flex-col gap-4 lg:flex-row">
          <ProfileRow
            id={applicant.id}
            profilePicture={applicant.profilePicture}
            socialMedia={applicant.socialMedia.map((socialMedia) => {
              return {
                userSocialMediaFollowers: socialMedia.userSocialMediaFollowers,
                handler: socialMedia.handler,
                id: socialMedia.id,
                socialMediaId: socialMedia.socialMediaId,
                socialMediaName: socialMedia.socialMediaName,
                url: socialMedia.url,
                valuePacks: [],
                mainSocialMedia: socialMedia.mainSocialMedia,
              };
            })}
            name={applicant.name}
            about={applicant.about}
            city={applicant.city?.name || ""}
            country={applicant?.country?.name || ""}
            username={applicant?.username || ""}
            type="Influencer"
            bookmarked={applicant?.bookmarked || false}
            highlightSocialMediaId={job.socialMediaId}
          />
          <div className="flex justify-around gap-4 lg:flex-col lg:justify-center">
            <Button
              title={t("pages.manageJobs.viewOrder")}
              level="terciary"
              size="large"
              onClick={() =>
                void router.push(`/orders/${applicant?.orderId || -1}`)
              }
            />
          </div>
        </div>
      );
    }
  };

  const renderSentJobApplicants = () => {
    let applicantsContainerClass = "flex flex-wrap gap-8";
    if (listView) {
      applicantsContainerClass = "flex flex-1 flex-col gap-8";
    }

    if (job) {
      return (
        <div className="flex flex-col gap-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsSentJobApplicantsOpen(!isSentJobApplicantsOpen)}
          >
            <div className="text-2xl font-bold">
              {t("pages.manageJobs.sentJobApplicants", {
                count: sentApplicants.length,
              })}
            </div>
            <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
              <div>
                {isSentJobApplicantsOpen ? (
                  <FontAwesomeIcon
                    icon={faSubtract}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-2xs cursor-pointer text-gray2"
                  />
                )}
              </div>
            </div>
          </div>
          {isSentJobApplicantsOpen && sentApplicants && (
            <div className={applicantsContainerClass}>
              {sentApplicants.map((applicant) => {
                return listView
                  ? renderSentJobApplicantRow(applicant)
                  : renderSentJobApplicantCard(applicant);
              })}
            </div>
          )}
        </div>
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    if (job) {
      const listIconClass = "fa-xl cursor-pointer text-gray2";
      const listIconSelectedClass = "fa-xl cursor-pointer text-influencer";

      return (
        <>
          <div className="flex w-full cursor-default flex-col gap-8 self-center p-8 pb-10 sm:p-4 sm:px-8 xl:w-3/4 xl:px-2 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
            {renderJobDetails()}
            <div className="w-full border-[1px] border-white1" />
            <div className="flex flex-1 justify-end gap-4">
              <FontAwesomeIcon
                icon={faList}
                className={listView ? listIconSelectedClass : listIconClass}
                onClick={() => setListView(!listView)}
              />
              <FontAwesomeIcon
                icon={faTableCellsLarge}
                className={!listView ? listIconSelectedClass : listIconClass}
                onClick={() => setListView(!listView)}
              />
            </div>
            {acceptedApplicants.length > 0 && renderAcceptedApplicants()}
            {applicants.length > 0 && job.jobStatus.id === 1 && (
              <>
                {acceptedApplicants.length > 0 && (
                  <div className="w-full border-[1px] border-white1" />
                )}
                {renderApplicants()}
              </>
            )}
            {sentApplicants.length > 0 && renderSentJobApplicants()}
            {rejectedApplicants.length > 0 && job.jobStatus.id === 1 && (
              <>
                {(applicants.length > 0 || acceptedApplicants.length > 0) && (
                  <div className="w-full border-[1px] border-white1" />
                )}
                {renderRejectedApplicants()}
              </>
            )}
          </div>
          <div className="flex justify-center">
            {isWarningModalOpen && (
              <MyJobsActionConfirmationModal
                onClose={() => setIsWarningModalOpen(false)}
                type={warningModalType}
                jobId={warningModalJobId}
                isJobDetails={true}
                archiveJob={archiveJob}
                deleteJob={deleteJob}
                publishJob={publishJob}
              />
            )}
          </div>
        </>
      );
    }
  }
};

export { ManageJobDetailsPage };
