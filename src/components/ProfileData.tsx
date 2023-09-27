import { type Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { helper } from "../utils/helper";
import { Button } from "../components/Button";

export type ProfileAdminIncludes = Prisma.ProfileGetPayload<{
  include: {
    acceptedJobs: {
      select: {
        id: true;
      };
    };
    appliedJobs: {
      select: {
        id: true;
      };
    };
    categories: true;
    city: true;
    country: true;
    createdJobs: {
      select: {
        id: true;
      };
    };
    favoriteBy: {
      select: {
        id: true;
      };
    };
    favorites: {
      select: {
        id: true;
      };
    };
    gender: true;
    portfolio: {
      select: {
        id: true;
      };
    };
    profileReviews: {
      select: {
        id: true;
      };
    };
    rejectedApplicants: {
      select: {
        id: true;
      };
    };
    submitedReviews: {
      select: {
        id: true;
      };
    };
    user: true;
    userSocialMedia: {
      include: {
        socialMedia: true;
      };
    };
  };
}>;

const ProfileData = (params: { profile: ProfileAdminIncludes }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileAdminIncludes | undefined>(
    undefined
  );

  const { mutate: verify, isLoading } = api.profiles.verifyProfile.useMutation({
    onSuccess: () => void refetch(),
  });

  const {
    data: updatedProfile,
    refetch,
    isRefetching,
    isFetching,
  } = api.profiles.getSingleProfileForAdmin.useQuery(
    {
      profileId: params.profile.id,
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  }, [updatedProfile]);

  useEffect(() => {
    if (params.profile) {
      setProfile(params.profile);
    }
  }, [params.profile]);

  if (profile) {
    return (
      <div
        key={profile.id}
        className="flex flex-col gap-2 rounded-lg border-[1px] p-4"
      >
        <div
          className="flex cursor-pointer items-center justify-between gap-4 "
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2 overflow-hidden">
              <div className="font-semibold text-influencer">ID:</div>
              <div>{profile.id}</div>
            </div>
            <Link
              href={`/${profile.user.username || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 overflow-hidden hover:underline"
            >
              <div className="font-semibold text-influencer">Username:</div>
              <div>
                {profile.user.username ? profile.user.username : "Not Created"}
              </div>
            </Link>

            <div className="flex gap-2 overflow-hidden">
              <div className="font-semibold text-influencer">Last Update:</div>
              <div>
                {helper.formatDate(profile.updatedAt, i18n.language) || ""}
              </div>
            </div>
          </div>
          {(profile.verifiedStatusId === 1 ||
            profile.verifiedStatusId === 3) && (
            <Button
              title={
                profile.verifiedStatusId === 1
                  ? "Verify"
                  : profile.verifiedStatusId === 3
                  ? "ReVerify"
                  : ""
              }
              level="primary"
              onClick={() => void verify({ profileId: params.profile.id })}
              isLoading={isLoading || isRefetching || isFetching}
            />
          )}
        </div>

        {isOpen && (
          <div className="flex flex-col gap-2">
            <div className="w-full border-[1px] border-white1" />
            <div className="flex gap-2 overflow-hidden">
              <div className="font-semibold text-influencer">Created At:</div>
              <div>
                {helper.formatDate(profile.createdAt, i18n.language) || ""}
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex w-auto gap-2 overflow-hidden">
                <div className="font-semibold text-influencer">Name:</div>
                <div>{profile.name || ""}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">Gender:</div>
                <div>{profile.gender?.name || ""}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">Website:</div>
                <Link href={`${profile.website || ""}`}>
                  {profile.website ? "visit" : "no website"}
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">Country:</div>
                <div>{profile.country?.name || ""}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">City:</div>
                <div>{profile.city?.name || ""}</div>
              </div>
            </div>
            <div className="flex w-full flex-1 flex-wrap gap-2">
              <div className="flex font-semibold text-influencer">
                Social Media:
              </div>
              {profile.userSocialMedia.map((socialMedia, index) => {
                return (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={socialMedia.url}
                    key={socialMedia.id}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <div>{socialMedia.socialMedia?.name}</div>
                    <div>{helper.formatNumber(socialMedia.followers)}</div>
                    {index !== profile.userSocialMedia.length - 1 && (
                      <div className="h-1 w-1 rounded-full bg-black" />
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">About:</div>
              <div>{profile.about.length > 0 ? "Has About" : "No About"}</div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">
                  Number Of Created Jobs:
                </div>
                <div>{profile.createdJobs.length || 0}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">
                  Number of Accepted Jobs:
                </div>
                <div>{profile.acceptedJobs.length || 0}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">
                  Number of Rejected Jobs:
                </div>
                <div>{profile.rejectedApplicants.length || 0}</div>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">Favorites:</div>
                <div>{profile.favorites.length || 0}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">
                  Favorited By:
                </div>
                <div>{profile.favoriteBy.length || 0}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="font-semibold text-influencer">Categories:</div>
              {profile.categories.map((category, index) => {
                return (
                  <span key={category.id}>
                    {category.name}
                    {index !== profile.categories.length - 1 && ", "}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Portfolio:</div>
              <div>{profile.portfolio.length || 0}</div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">
                  Profile Reviews:
                </div>
                <div>{profile.profileReviews.length || 0}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">
                  Profiles Reviewd:
                </div>
                <div>{profile.submitedReviews.length || 0}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-semibold text-influencer">Rating:</div>
                <div>{profile.rating || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export { ProfileData };
