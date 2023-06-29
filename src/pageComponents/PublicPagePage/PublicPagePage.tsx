import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faPencil,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

import { Layout } from "../../components/Layout/Layout";
import Link from "next/link";
import { PictureCarrosel } from "../../components/PictureCarrosel/PictureCarrosel";

const PublicPagePage = (params: { userId: string | undefined }) => {
  const { data: profile, isLoading: isLoadingProfile } =
    api.profiles.getProfileWithoutIncludes.useQuery();
  const { data: profileSocialMedia } =
    api.userSocialMedias.getUserSocialMediaByProfileId.useQuery({
      profileId: profile?.id || -1,
    });
  const { data: profileValuePack } =
    api.valuesPacks.getValuePacksByProfileId.useQuery({
      profileId: profile?.id || -1,
    });

  const renderHeader = () => {
    return (
      <div className="flex flex-1 cursor-default flex-col-reverse gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4 lg:flex-row lg:items-start">
          <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
          <div className="flex flex-1 flex-col text-center lg:text-left">
            <div className="flex gap-4">
              {profileSocialMedia?.map((socialMedia) => {
                return (
                  <div key={socialMedia.id} className="flex gap-2">
                    <div className="cursor-pointer font-semibold text-influencer">
                      {socialMedia.socialMedia?.name}
                    </div>
                    <div>{socialMedia.followers}</div>
                  </div>
                );
              })}
            </div>
            <div className="text-4xl font-bold">{profile?.name}</div>
            <div className="text-lg text-gray2">
              {profile?.country}, {profile?.city}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-row-reverse items-start justify-end gap-4 lg:flex-row">
          {params.userId && (
            <Link
              href={`/${params.userId}/edit`}
              className="flex cursor-pointer items-center gap-2"
            >
              <FontAwesomeIcon
                icon={faPencil}
                className="fa-lg text-influencer"
              />

              <div className="underline">Edit</div>
            </Link>
          )}
          <div className="flex cursor-pointer items-center gap-2">
            <FontAwesomeIcon icon={faShareFromSquare} className="fa-lg" />

            <div className="underline">Share</div>
          </div>
          <div className="flex cursor-pointer items-center gap-2">
            <FontAwesomeIcon icon={faBookmark} className="fa-lg" />

            <div className="underline">Save</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMiddleContent = () => {
    return (
      <div className="just flex flex-1 flex-col-reverse gap-12 lg:flex-row">
        <div className="flex flex-1 flex-col items-start gap-4">
          <PictureCarrosel />
        </div>

        <div className="flex flex-1">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold">About</div>
            <div className="text-gray2 [overflow-wrap:anywhere]">
              {profile?.about}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center gap-4 px-12 pb-10">
        {renderHeader()}
        {renderMiddleContent()}
        <div className="w-full border-[1px] border-white1" />
      </div>
    </Layout>
  );
};

export { PublicPagePage };
