import { useTranslation } from "next-i18next";
import { type JobIncludes } from "../../../utils/globalTypes";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faChevronLeft,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { helper } from "../../../utils/helper";
import { Button } from "../../../components/Button";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import type { Prisma, Role } from "@prisma/client";

export type ProfileIncludes = Prisma.ProfileGetPayload<{
  include: {
    categories: true;
    userSocialMedia: {
      select: {
        socialMediaFollowers: true;
        handler: true;
        id: true;
        socialMedia: true;
      };
    };
  };
}>;

const JobDetails = (params: {
  setSelectedJobId: () => void;
  selectedJobId: string;
  openLoginModal: () => void;
  openShareModal: () => void;
  type: "mobile" | "desktop";
  userRole: Role | undefined;
  profile: ProfileIncludes | undefined;
}) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const detailsContainer = useRef<HTMLDivElement>(null);
  const ctx = api.useUtils();

  const [job, setJob] = useState<JobIncludes>();
  const [applied, setApplied] = useState<boolean>();
  const [disableApply, setDisableApply] = useState<boolean>(false);

  const { data: jobsData, isLoading } = api.jobs.getSimpleJob.useQuery({
    jobId: params?.selectedJobId || "",
  });

  const { mutate: applyToJob, isLoading: applicationIsLoading } =
    api.jobs.applyToJob.useMutation({
      onSuccess: () => {
        setApplied(true);
        void ctx.jobs.getSimpleJob.invalidate().then(() => {
          toast.success(t("pages.jobs.appliedSuccess"), {
            position: "bottom-left",
          });
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
        setApplied(false);
        void ctx.jobs.getSimpleJob.invalidate().then(() => {
          toast.success(t("pages.jobs.removedApplicationSuccess"), {
            position: "bottom-left",
          });
        });
      },
      onError: () => {
        toast.error(t("general.error.generalErrorMessage"), {
          position: "bottom-left",
        });
      },
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

    const checkIfUserHasRequirements = (
      job: JobIncludes,
      profile: ProfileIncludes
    ) => {
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
    };

    if (jobsData) {
      if (params.profile) {
        const hasRequirements = checkIfUserHasRequirements(
          jobsData,
          params.profile
        );

        if (!hasRequirements || jobsData.jobStatusId !== 1) {
          setDisableApply(true);
        }
      }

      setApplied(checkIfUserHasApplied(jobsData));
      setJob(jobsData);
    }
  }, [
    jobsData,
    params.profile,
    params.profile?.userSocialMedia,
    session.data?.user.id,
  ]);

  useEffect(() => {
    detailsContainer.current?.scrollTo(0, 0);

    if (params.type === "mobile") {
      window.scrollTo(0, 0);
    }
  }, [params, job, params.type]);

  const onApply = (job: JobIncludes) => {
    if (session.status === "authenticated" && params.profile) {
      if (applied) {
        removeApplication({ jobId: job.id });
      } else {
        applyToJob({ jobId: job.id });
      }
    } else if (session.status === "authenticated" && !params.profile) {
      toast.error(t("pages.jobs.toastWarning"), {
        position: "bottom-left",
      });
    } else {
      params.openLoginModal();
    }
  };

  const shareButton = () => {
    return (
      <div
        className="flex items-center gap-2"
        onClick={() => params.openShareModal()}
      >
        <FontAwesomeIcon
          icon={faShareFromSquare}
          className="fa-lg cursor-pointer"
        />

        <div className="cursor-pointer underline">{t("pages.jobs.share")}</div>
      </div>
    );
  };

  const renderBackButton = () => {
    return (
      <div className="flex items-center justify-between lg:hidden">
        <div
          className="flex cursor-pointer items-center gap-2 py-2 lg:hidden"
          onClick={() => params.setSelectedJobId()}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="fa-sm text-gray2 hover:text-influencer "
          />
          {t("pages.jobs.goBack")}
        </div>
        {shareButton()}
      </div>
    );
  };

  const renderJobHeader = () => {
    if (job) {
      return (
        <div className="flex justify-between">
          <Link
            href={`jobs/${job.id}`}
            className="w-auto text-2xl font-semibold hover:underline lg:w-auto lg:max-w-[80%]"
          >
            {job?.jobSummary}
          </Link>
          <div className="hidden lg:flex lg:items-start">{shareButton()}</div>
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
        <div className="flex flex-wrap gap-2">
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
        <div>{job?.userSocialMediaFollowers?.name || ""}</div>
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
        <div>{helper.calculerMonetaryValue(job?.price || 0)}€</div>
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
    if (job && (!params.userRole || params.userRole.id !== 1)) {
      let title = applied
        ? t("pages.jobs.removeApplication")
        : t("pages.jobs.apply");

      if (disableApply) {
        title = t("pages.jobs.noRequirements");
      }
      return (
        <div key={`ApplyButton${job.id}`}>
          <Button
            title={title}
            level={applied ? "secondary" : "primary"}
            size="large"
            isLoading={applicationIsLoading || removingIsLoading}
            onClick={() => onApply(job)}
            disabled={disableApply}
          />
        </div>
      );
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
    <div
      className="flex flex-1 flex-col overflow-y-auto rounded-lg border-0 px-4 lg:rounded-none lg:border-0 lg:border-l-[1px]"
      ref={detailsContainer}
    >
      {isLoading ? (
        <div className="h-full w-full items-center justify-center lg:relative">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {renderBackButton()}
          <div>
            {renderJobHeader()}
            {renderJobSubHeader()}
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
  );
};

export { JobDetails };
