import { type NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPencil } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { Layout } from "../../components/Layout/Layout";
import { PictureCarrosel } from "../../components/PictureCarrosel/PictureCarrosel";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

const MyPage: NextPage = () => {
  const { data, isLoading } = api.profiles.getProfile.useQuery();

  if (isLoading) return null;

  const renderProfileDescription = () => {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Profile Description</div>
          <FontAwesomeIcon
            icon={faPencil}
            className="fa-lg cursor-pointer text-influencer"
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
          </div>
          <div className="text-4xl font-bold">{data?.name}</div>
          <div className="text-lg text-gray2">
            {data?.country}, {data?.city}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-semibold">About</div>
          <div className="text-gray2">{data?.about}</div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="text-2xl font-semibold">Categories</div>
          <div className="flex flex-wrap gap-4">
            {data?.categories.map((category) => {
              return (
                <div
                  key={category.id}
                  className="rounded-2xl border-[1px] border-gray2 px-4 py-1"
                >
                  {category.name}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderSocialMedia = () => {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Social Media</div>
          <FontAwesomeIcon
            icon={faPencil}
            className="fa-lg cursor-pointer text-influencer"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          {data?.userSocialMedia.map((socialMedia) => {
            return (
              <div key={socialMedia.id} className="flex gap-2">
                <div className="font-semibold text-influencer">
                  {socialMedia.socialMedia?.name}
                </div>
                <div>{socialMedia.followers}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisualPortfolio = () => {
    return (
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="text-2xl font-semibold">Visual Portfolio</div>
        <div className="flex flex-col items-start gap-4 self-start">
          <PictureCarrosel />
        </div>
      </div>
    );
  };

  const renderValuePacks = () => {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">Value Packs</div>
          <FontAwesomeIcon
            icon={faPencil}
            className="fa-lg cursor-pointer text-influencer"
          />
        </div>
        <div className="flex gap-4">
          {data?.valuePacks.map((valuePack) => {
            return (
              <div
                key={valuePack.id}
                className="flex flex-1 flex-col rounded-2xl border-[1px] border-gray2 p-4"
              >
                <div>{valuePack.title}</div>
                <div>{valuePack.description}</div>
                <div className="flex flex-1 justify-between">
                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="fa-lg cursor-pointer text-influencer"
                      />
                      <div>{valuePack.deliveryTime} Days Delivery</div>
                    </div>
                    <div>{valuePack.numberOfRevisions} Of Revisions</div>
                  </div>
                  <div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-1 sm:justify-center">
        <div className="flex w-full cursor-default flex-col px-12 sm:w-8/12">
          <div className="flex w-full flex-1 flex-col gap-4 lg:flex-row">
            <div className="flex flex-1 flex-col gap-12">
              {renderProfileDescription()}
              {renderSocialMedia()}
            </div>
            {renderVisualPortfolio()}
          </div>
          {renderValuePacks()}
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;
