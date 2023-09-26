import { useTranslation } from "react-i18next";
import { type JobIncludes } from "../../../utils/globalTypes";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { helper } from "../../../utils/helper";
import { Button } from "../../../components/Button";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { type Role } from "@prisma/client";

const MyApplicationsDetails = (params: {
  setSelectedJobId: () => void;
  selectedJobId: number;
  type: "mobile" | "desktop";
  userRole: Role | undefined;
}) => {
  const { t, i18n } = useTranslation();
  const session = useSession();
  const detailsContainer = useRef<HTMLDivElement>(null);
  const ctx = api.useContext();

  const [job, setJob] = useState<JobIncludes>();
  const [applied, setApplied] = useState<boolean>(false);

  const { data: jobData, isLoading } = api.offers.getSimpleOffer.useQuery(
    {
      offerId: params?.selectedJobId || -1,
    },
    {
      cacheTime: 0,
    }
  );

  const { mutate: applyToJob, isLoading: applicationIsLoading } =
    api.offers.applyToOffer.useMutation({
      onSuccess: () => {
        setApplied(true);
        void ctx.offers.getSimpleOffer.invalidate().then(() => {
          toast.success(t("pages.applications.appliedSuccess"), {
            position: "bottom-left",
          });
        });
      },
    });
  const { mutate: removeApplication, isLoading: removingIsLoading } =
    api.offers.removeOfferApplication.useMutation({
      onSuccess: () => {
        setApplied(false);
        void ctx.offers.getSimpleOffer.invalidate().then(() => {
          toast.success(t("pages.applications.removedApplicationSuccess"), {
            position: "bottom-left",
          });
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

    if (jobData) {
      setApplied(checkIfUserHasApplied(jobData));
      setJob(jobData);
    }
  }, [jobData, session.data?.user.id]);

  useEffect(() => {
    detailsContainer.current?.scrollTo(0, 0);

    if (params.type === "mobile") {
      window.scrollTo(0, 0);
    }
  }, [params, job, params.type]);

  const onApply = (job: JobIncludes) => {
    if (applied) {
      removeApplication({ offerId: job.id });
    } else {
      applyToJob({ offerId: job.id });
    }
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
          {t("pages.applications.goBack")}
        </div>
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
            {job?.offerSummary}
          </Link>
        </div>
      );
    }
  };

  const renderJobSubHeader = () => {
    return (
      <div className="flex flex-wrap items-center gap-2 text-gray2">
        <Link
          href={`/${job?.offerCreator?.user?.username || ""}`}
          className="hover:underline"
        >
          {job?.offerCreator?.name}
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
                key={`details${contentType.id}${job?.offerCreator?.name || ""}`}
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
          {t("pages.applications.followers")}
        </div>
        <div>
          {helper.formatNumberWithKorM(job?.minFollowers || 0)} -{" "}
          {helper.formatNumberWithKorM(job?.maxFollowers || 0)}
        </div>
      </div>
    );
  };

  const renderGender = () => {
    if (job) {
      return (
        <div className="flex gap-2">
          <div className="font-semibold text-influencer">
            {t("pages.applications.gender")}
          </div>
          <div>
            {job?.gender && job?.gender.name
              ? t(`pages.applications.${job.gender.name}`)
              : t(`pages.applications.any`)}
          </div>
        </div>
      );
    }
  };

  const renderCategories = () => {
    return (
      <div className="flex flex-wrap items-center font-normal text-black">
        <span className="pr-2 font-semibold text-influencer">
          {t("pages.applications.categories")}
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
          {t("pages.applications.jobPay")}
        </div>
        <div>{helper.formatNumber(job?.price || 0)}€</div>
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
              {t("pages.applications.applicants", {
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
      return (
        <div>
          <Button
            key={`ApplyButton${job.id}`}
            title={
              applied
                ? t("pages.applications.removeApplication")
                : t("pages.applications.apply")
            }
            level={applied ? "secondary" : "primary"}
            size="large"
            isLoading={applicationIsLoading || removingIsLoading}
            onClick={() => onApply(job)}
          />
        </div>
      );
    }
  };

  const renderJobAbout = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold text-influencer">
          {t("pages.applications.aboutJob")}
        </div>
        <div className="whitespace-pre-line">{job?.OfferDetails}</div>
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

export { MyApplicationsDetails };
