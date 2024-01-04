import Image from "next/image";
import { type Prisma } from "@prisma/client";
import Link from "next/link";

import { Button } from "../../../components/Button";
import { helper } from "../../../utils/helper";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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
        socialMediaFollowers: true;
        socialMedia: true;
      };
    };
  };
}>;

const ProfileRow = (params: { profile: ProfileAdminIncludes }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="flex w-full flex-1 cursor-pointer flex-col"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex w-full flex-1 flex-col items-center md:flex-row">
        <div className="flex w-full flex-col items-center gap-1 border-b-[1px] p-2 md:w-32 md:items-start md:border-none">
          <Image
            src={params.profile.profilePicture || ""}
            alt="profile picture"
            width={400}
            height={400}
            quality={100}
            className="pointer-events-none h-24 w-24 rounded-full object-cover"
          />
        </div>
        <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/6 md:border-none md:text-left">
          <div className="font-semibold text-influencer">Name</div>
          <div>{params.profile.name}</div>
        </div>
        <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/6 md:border-none md:text-left">
          <div className="font-semibold text-influencer">Email</div>
          <div>{params.profile.user.email}</div>
        </div>
        <Link
          href={`/${params.profile.user.username || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 hover:underline md:w-1/6 md:border-none md:text-left"
        >
          <div className="font-semibold text-influencer">Username</div>
          <div>{params.profile.user.username}</div>
        </Link>
        <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/6 md:border-none md:text-left">
          <div className="font-semibold text-influencer">Has Social Media</div>
          <div>{params.profile.userSocialMedia.length > 0 ? "Yes" : "No"}</div>
        </div>
        <div className="line-clamp-1 flex w-full flex-col gap-1 border-b-[1px] p-2 md:w-1/6 md:border-none md:text-left">
          <div className="font-semibold text-influencer">Created At</div>
          {helper.formatDate(params.profile.createdAt, i18n.language)}
        </div>
        <div className="line-clamp-1 flex w-full flex-col gap-1 p-2 md:w-1/6 md:text-left">
          <Button title={"View Profile"} level="primary" size="regular" />
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2">
          <div className="w-full border-[1px] border-white1" />
          <div className="flex w-auto gap-2 overflow-hidden">
            <div className="font-semibold text-influencer">Id:</div>
            <div>#{params.profile.id || ""}</div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2 overflow-hidden">
              <div className="font-semibold text-influencer">Created At:</div>
              <div>
                {helper.formatDate(params.profile.createdAt, i18n.language) ||
                  ""}
              </div>
            </div>
            <div className="flex gap-2 overflow-hidden">
              <div className="font-semibold text-influencer">
                Last Updated At:
              </div>
              <div>
                {helper.formatDate(params.profile.updatedAt, i18n.language) ||
                  ""}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex w-auto gap-2 overflow-hidden">
              <div className="font-semibold text-influencer">Name:</div>
              <div>{params.profile.name || ""}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Gender:</div>
              <div>{params.profile.gender?.name || ""}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Website:</div>
              <Link href={`${params.profile.website || ""}`}>
                {params.profile.website ? "visit" : "no website"}
              </Link>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Email:</div>
              <div>{params.profile.user.email || ""}</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Country:</div>
              <div>{params.profile.country?.name || ""}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">City:</div>
              <div>{params.profile.city?.name || ""}</div>
            </div>
          </div>
          <div className="flex w-full flex-1 flex-wrap gap-2">
            <div className="flex font-semibold text-influencer">
              Social Media:
            </div>
            {params.profile.userSocialMedia.map((socialMedia, index) => {
              return (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={socialMedia.url}
                  key={socialMedia.id}
                  className="flex items-center gap-2 hover:underline"
                >
                  <div>{socialMedia.socialMedia?.name}</div>
                  <div>{socialMedia.socialMediaFollowers?.name}</div>
                  {index !== params.profile.userSocialMedia.length - 1 && (
                    <div className="h-1 w-1 rounded-full bg-black" />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">About:</div>
            <div>
              {params.profile.about.length > 0 ? "Has About" : "No About"}
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                Number Of Created Jobs:
              </div>
              <div>{params.profile.createdJobs.length || 0}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                Number of Accepted Jobs:
              </div>
              <div>{params.profile.acceptedJobs.length || 0}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                Number of Rejected Jobs:
              </div>
              <div>{params.profile.rejectedApplicants.length || 0}</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Favorites:</div>
              <div>{params.profile.favorites.length || 0}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Favorited By:</div>
              <div>{params.profile.favoriteBy.length || 0}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="font-semibold text-influencer">Categories:</div>
            {params.profile.categories.map((category, index) => {
              return (
                <span key={category.id}>
                  {category.name}
                  {index !== params.profile.categories.length - 1 && ", "}
                </span>
              );
            })}
          </div>
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">Portfolio:</div>
            <div>{params.profile.portfolio.length || 0}</div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                Profile Reviews:
              </div>
              <div>{params.profile.profileReviews.length || 0}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">
                Profiles Reviewd:
              </div>
              <div>{params.profile.submitedReviews.length || 0}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold text-influencer">Rating:</div>
              <div>{params.profile.rating || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProfileRow };
