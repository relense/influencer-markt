import { useTranslation } from "next-i18next";
import { type JobIncludes } from "../../utils/globalTypes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";
import { ShareModal } from "../../components/ShareModal";

const JobDetailsPage = (params: {
  jobId: string;
  openLoginModal: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const [job, setJob] = useState<JobIncludes>();
  const [applied, setApplied] = useState<boolean>();
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>();
  const [disableApply, setDisableApply] = useState<boolean>(false);

  const { data: profile } = api.profiles.getProfile.useQuery();

  const {
    data: jobData,
    refetch: refetcheJob,
    isLoading,
  } = api.jobs.getSimpleJob.useQuery({
    jobId: params.jobId || "",
  });

  const { mutate: applyToJob, isLoading: applicationIsLoading } =
    api.jobs.applyToJob.useMutation({
      onSuccess: () => {
        void refetcheJob();
        toast.success(t("pages.jobs.appliedSuccess"), {
          position: "bottom-left",
        });
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });
  const { mutate: removeApplication, isLoading: removingIsLoading } =
    api.jobs.removeJobApplication.useMutation({
      onSuccess: () => {
        void refetcheJob();
        toast.success(t("pages.jobs.removedApplicationSuccess"), {
          position: "bottom-left",
        });
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
    });

  const { data: userRole } = api.users.getUserRole.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  useEffect(() => {
    const checkIfUserHasApplied = (job: JobIncludes) => {
      let hasApplied = false;

      const applied = !!job.applicants.find(
        (applicant) => applicant.userId === session.data?.user.id
      );

      const isAccepted = !!job.acceptedApplicants.find(
        (applicant) => applicant.userId === session.data?.user.id
      );

      const isRejected = !!job.rejectedApplicants.find(
        (applicant) => applicant.userId === session.data?.user.id
      );

      if (applied || isAccepted || isRejected) {
        hasApplied = true;
      }

      return hasApplied;
    };

    const checkIfUserHasRequirements = (job: JobIncludes) => {
      if (profile) {
        const hasSocialMedia = profile?.userSocialMedia.find(
          (userSocialMedia) =>
            userSocialMedia.socialMedia?.id === job?.socialMediaId
        );

        let hasFollowers = false;
        if (hasSocialMedia) {
          hasFollowers =
            hasSocialMedia.socialMediaFollowers?.id ===
            job.userSocialMediaFollowersId;
        }

        const hasJobGender =
          profile.genderId === job.genderId || job.gender === null;

        const hasCountry = profile.countryId === job.countryId;

        const hasCategory = profile.categories.some((category) =>
          job.categories.some((jobCategory) => jobCategory.id === category.id)
        );

        const isCreator = job.jobCreator.id === profile.id;

        return (
          !!hasSocialMedia &&
          hasJobGender &&
          hasCountry &&
          hasFollowers &&
          hasCategory &&
          !isCreator
        );
      }
    };

    if (jobData) {
      if (profile) {
        const hasRequirements = checkIfUserHasRequirements(jobData);

        if (!hasRequirements) {
          setDisableApply(true);
        }
      }

      setApplied(checkIfUserHasApplied(jobData));
      setJob(jobData);
    }
  }, [jobData, profile, profile?.userSocialMedia, session.data?.user.id]);

  const onApply = (job: JobIncludes) => {
    if (session.status === "authenticated" && profile) {
      if (applied) {
        removeApplication({ jobId: job.id });
      } else {
        applyToJob({ jobId: job.id });
      }
    } else if (session.status === "authenticated" && !profile) {
      toast.error(t("pages.jobs.toastWarning"), {
        position: "bottom-left",
      });
    } else {
      console.log("");
    }
  };

  const shareButton = () => {
    return (
      <div
        className="mt-1 flex items-start gap-2"
        onClick={() => setIsShareModalOpen(true)}
      >
        <FontAwesomeIcon
          icon={faShareFromSquare}
          className="fa-lg cursor-pointer"
        />

        <div className="cursor-pointer underline">{t("pages.jobs.share")}</div>
      </div>
    );
  };

  const renderJobCreatorPicture = () => {
    if (job) {
      return (
        <Link
          href={`/${job?.jobCreator?.user?.username || ""}`}
          className="h-20 w-32 cursor-pointer"
        >
          <Image
            src={job.jobCreator.profilePicture || ""}
            alt={`${job.jobCreator.name} profile picture`}
            width={1000}
            height={1000}
            className="h-full w-full rounded-lg object-cover"
            priority
          />
        </Link>
      );
    }
  };

  const renderJobHeader = () => {
    if (job) {
      return (
        <div className="flex items-start justify-between">
          <div className="w-auto text-2xl font-semibold lg:w-auto lg:max-w-[80%]">
            {job?.jobSummary}
          </div>
          <div className="hidden lg:flex">{shareButton()}</div>
        </div>
      );
    }
  };

  const renderJobSubHeader = () => {
    return (
      <div className="flex flex-wrap items-center gap-2 text-gray2">
        <Link
          href={`/${job?.jobCreator?.user?.username || ""}`}
          className="hover:underline"
        >
          {job?.jobCreator?.name}
        </Link>
        <div className="h-1 w-1 rounded-full bg-black" />
        <div>
          {job?.country?.name}
          {job?.state?.name ? `,${job?.state?.name}` : ""}
        </div>
        {job?.createdAt && (
          <>
            <div className="h-1 w-1 rounded-full bg-black" />

            <div>{helper.formatDate(job?.createdAt, i18n.language)}</div>
          </>
        )}
      </div>
    );
  };

  const renderPlatformWithContentType = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {job?.socialMedia?.name}
        </div>
        <div className="flex gap-2">
          {job?.contentTypeWithQuantity.map((contentType) => {
            return (
              <div
                key={`details${contentType.id}${job?.jobCreator?.name || ""}`}
                className="flex gap-1 text-black"
              >
                <div>
                  {t(
                    `general.contentTypesPlural.${contentType.contentType.name}`,
                    { count: contentType.amount }
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFollowers = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {t("pages.jobs.followers")}
        </div>
        <div>{job?.userSocialMediaFollowers?.name || ""} </div>
      </div>
    );
  };

  const renderGender = () => {
    if (job) {
      return (
        <div className="flex gap-2">
          <div className="font-semibold text-influencer">
            {t("pages.jobs.gender")}
          </div>
          <div>
            {job?.gender && job?.gender.name
              ? t(`pages.jobs.${job.gender.name}`)
              : t(`pages.jobs.any`)}
          </div>
        </div>
      );
    }
  };

  const renderCategories = () => {
    return (
      <div className="flex flex-wrap items-center font-normal text-black">
        <span className="pr-2 font-semibold text-influencer">
          {t("pages.jobs.categories")}
        </span>
        {job?.categories.map((category, index) => {
          return (
            <div key={`categories${category.id}`} className="pr-2">
              {`${t(`general.categories.${category.name}`)}${
                job?.categories.length - 1 !== index ? "," : ""
              }`}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPrice = () => {
    return (
      <div className="flex gap-2">
        <div className="font-semibold text-influencer">
          {t("pages.jobs.jobPay")}
        </div>
        <div>{helper.calculerMonetaryValue(job?.price || 0)}</div>
      </div>
    );
  };

  const renderApplicants = () => {
    if (job?.applicants && job?.applicants.length > 0) {
      return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {t("pages.jobs.applicants", {
                count: job?.applicants.length,
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderApplyButton = () => {
    if (job && (!userRole?.role || userRole?.role.id !== 1)) {
      let title = applied
        ? t("pages.jobs.removeApplication")
        : t("pages.jobs.apply");

      if (disableApply) {
        title = t("pages.jobs.noRequirements");
      }

      if (job.jobStatusId === 1) {
        return (
          <div>
            <Button
              title={title}
              level={applied ? "secondary" : "primary"}
              size="large"
              isLoading={isLoading || applicationIsLoading || removingIsLoading}
              onClick={() => onApply(job)}
              disabled={disableApply}
            />
          </div>
        );
      } else {
        return (
          <div className="rounded-xl bg-influencer-light p-4 text-center font-semibold text-white">
            {t("pages.jobs.noLongerAvailable")}
          </div>
        );
      }
    }
  };

  const renderJobAbout = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold text-influencer">
          {t("pages.jobs.aboutJob")}
        </div>
        <div className="whitespace-pre-line">{job?.JobDetails}</div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-5 mt-5 flex w-full cursor-default flex-col gap-8 self-center px-4 sm:px-12 xl:w-2/4 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-3 p-4 sm:p-0">
            <div className="flex justify-between lg:hidden">
              {renderJobCreatorPicture()}
              {shareButton()}
            </div>
            <div className="flex gap-4">
              <div className="hidden lg:flex">{renderJobCreatorPicture()}</div>
              <div className="flex flex-1 flex-col gap-2">
                {renderJobHeader()}
                {renderJobSubHeader()}
              </div>
            </div>
            {renderPlatformWithContentType()}
            {renderFollowers()}
            {renderGender()}
            {renderCategories()}
            {renderPrice()}
            {renderApplicants()}
            {renderApplyButton()}
            {renderJobAbout()}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {isShareModalOpen && (
          <ShareModal
            modalTitle={t("pages.jobs.shareModalTitle")}
            onClose={() => setIsShareModalOpen(false)}
            url={`${window.location.origin}/jobs/${params.jobId}`}
          />
        )}
      </div>
    </>
  );
};

export { JobDetailsPage };
