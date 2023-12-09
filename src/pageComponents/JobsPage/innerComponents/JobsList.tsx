import { useRef } from "react";
import Image from "next/image";
import type { Role, Prisma } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { type JobIncludes } from "../../../utils/globalTypes";
import { Button } from "../../../components/Button";
import { helper } from "../../../utils/helper";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

type ProfileIncludes = Prisma.ProfileGetPayload<{
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

const JobsList = (params: {
  jobsCount: number;
  jobs: JobIncludes[];
  onChangeJob: (job: JobIncludes) => void;
  selectedJobId: string;
  fetchMoreJobs: () => void;
  isRefetchingJobsWithCursor: boolean;
  isLoading: boolean;
  profile: ProfileIncludes | undefined;
  userRole: Role | undefined;
}) => {
  const { t, i18n } = useTranslation();
  const listContainer = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-1 flex-col overflow-y-auto" ref={listContainer}>
      {params.isLoading ? (
        <div className="relative h-[50vh] w-full lg:h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {params.jobs.length > 0 && (
            <div className="bg-influencer-green-dark p-4 text-center text-white">
              {t("pages.jobs.jobsAvailable", {
                available: helper.formatNumberWithKorM(params.jobsCount),
              })}
            </div>
          )}
          {params.jobs?.map((job, index) => {
            let jobClass =
              "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-super-light";

            if (params.selectedJobId === job.id) {
              jobClass =
                "flex cursor-pointer gap-4 p-4 hover:bg-influencer-green-super-light bg-influencer-green-super-light";
            }

            return (
              <div key={`job${job.id}`}>
                <div
                  className={jobClass}
                  onClick={() => params.onChangeJob(job)}
                >
                  <div className="h-20 w-32">
                    <Image
                      src={job?.jobCreator?.profilePicture || ""}
                      alt={`${job.jobCreator.name} profile picture`}
                      width={1000}
                      height={1000}
                      className="h-full w-full rounded-lg object-cover"
                      priority
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <div className="font-semibold text-influencer">
                      {job.jobSummary}
                    </div>
                    <div className="text-sm">{job.jobCreator.name}</div>
                    <div className="flex flex-1 items-center gap-2 text-sm text-gray2">
                      <div>
                        {job?.country?.name || ""}
                        {job?.state?.name ? `,${job.state.name}` : ""}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-black" />
                      <div>
                        {helper.formatDate(job?.createdAt, i18n.language)}
                      </div>
                    </div>

                    <div className="flex gap-2 text-sm text-gray2">
                      <div className="flex flex-wrap gap-2 font-semibold text-influencer">
                        <div className="flex flex-wrap gap-2">
                          {job.socialMedia.name}{" "}
                          {job.contentTypeWithQuantity.map((contentType) => {
                            return (
                              <div
                                key={`jobsList${contentType.id}${job.jobCreator.name}`}
                                className="flex gap-1 font-semibold text-black"
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
                    </div>
                    <div className="flex gap-2 text-sm">
                      <div className="font-semibold text-influencer">
                        {t("pages.jobs.jobPay")}
                      </div>
                      <div className="font-semibold text-black">
                        {helper.calculerMonetaryValue(job?.price || 0)}
                      </div>
                    </div>
                    {params.profile &&
                      params.userRole &&
                      params.userRole.id === 2 &&
                      checkIfUserHasRequirements(job, params.profile) && (
                        <div className="flex gap-1 text-sm">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="fa-lg text-influencer-green"
                          />
                          <div className="font-semibold ">
                            {t("pages.jobs.matchsProfile")}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                {index !== params.jobs.length - 1 && (
                  <div className="w-full border-[1px] border-white1" />
                )}
              </div>
            );
          })}
          {params.jobsCount > params.jobs.length && (
            <div className="flex items-center justify-center p-2">
              <Button
                title={t("pages.jobs.loadMore")}
                onClick={() => params.fetchMoreJobs()}
                isLoading={params.isRefetchingJobsWithCursor}
                size="regular"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { JobsList };
