import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faShareFromSquare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

import { Layout } from "../../components/Layout";
import Link from "next/link";
import { PictureCarrosel } from "../../components/PictureCarrosel";
import { Button } from "../../components/Button";
import { CustomSelect } from "../../components/CustomSelect";
import { type Option } from "../../components/CustomMultiSelect";
import { type ValuePackType } from "../FirstStepsPage/Views/Step4";

import { useEffect, useState } from "react";
import { helper } from "../../utils/helper";
import { ValuePackInput } from "./innerComponents/ValuePackInput";
import { RequestCustomValuePackModal } from "./innerComponents/RequestCustomValuePackModal";
import { ToolTip } from "../../components/ToolTip";
import { Modal } from "../../components/Modal";
import { Review } from "../../components/Review";
import Image from "next/image";

const PublicProfilePage = (params: { username: string }) => {
  const [isCustomValuePackModalOpen, setIsCustomValuePackModalOpen] =
    useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review>();
  const [selectedValuePack, setSelectedValuePack] = useState<ValuePackType>({
    id: -1,
    title: "",
    platform: { id: -1, name: "" },
    description: "",
    deliveryTime: -1,
    numberOfRevisions: -1,
    valuePackPrice: -1,
  });
  const [platform, setPlatform] = useState<Option>({ id: -1, name: "" });
  const [availablePlatforms, setAvailablePlatforms] = useState<Option[]>([]);

  const { data: profile } = api.profiles.getProfileByUniqueUsername.useQuery({
    username: params.username,
  });
  const { data: profileSocialMedia } =
    api.userSocialMedias.getUserSocialMediaByProfileId.useQuery({
      profileId: profile?.id || -1,
    });
  const { data: profileValuePack } =
    api.valuesPacks.getValuePacksByProfileId.useQuery({
      profileId: profile?.id || -1,
    });
  const { data: profileReviews } = api.reviews.getProfileReviews.useQuery({
    profileId: profile?.id || -1,
  });

  useEffect(() => {
    if (profileValuePack && profileValuePack[0]) {
      setPlatform({
        id: profileValuePack[0]?.socialMedia?.id || -1,
        name: profileValuePack[0]?.socialMedia?.name || "",
      });

      setSelectedValuePack({
        id: profileValuePack[0].id,
        title: profileValuePack[0].title,
        platform: {
          id: profileValuePack[0].socialMedia?.id || -1,
          name: profileValuePack[0].socialMedia?.name || "",
        },
        description: profileValuePack[0].description,
        deliveryTime: profileValuePack[0].deliveryTime,
        numberOfRevisions: profileValuePack[0].numberOfRevisions,
        valuePackPrice: profileValuePack[0].valuePackPrice,
      });
    }
  }, [availablePlatforms, profileValuePack]);

  useEffect(() => {
    const uniqueOptionsSet = new Set<number>();
    const uniqueOptions: Option[] = [];

    if (profileValuePack) {
      profileValuePack.forEach((valuePack) => {
        if (
          valuePack.socialMedia &&
          !uniqueOptionsSet.has(valuePack.socialMedia.id)
        ) {
          uniqueOptionsSet.add(valuePack.socialMedia.id);
          uniqueOptions.push({
            id: valuePack.socialMedia.id,
            name: valuePack.socialMedia.name,
          });
        }
      });
    }

    setAvailablePlatforms(uniqueOptions);
  }, [profileValuePack]);

  const openReviewModal = (review: Review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedReview(undefined);
    setIsReviewModalOpen(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-1 cursor-default flex-col-reverse gap-4 lg:flex-row">
        <div className="flex-2 flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          {profile?.profilePicture ? (
            <Image
              src={profile?.profilePicture || ""}
              alt="profile picture"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover "
            />
          ) : (
            <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-[1px] border-gray3">
              <FontAwesomeIcon icon={faCamera} className="fa-2x text-gray3" />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2 text-center lg:text-left">
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              {profileSocialMedia?.map((socialMedia) => {
                return (
                  <div key={socialMedia.id} className="flex gap-2">
                    <Link
                      href={socialMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer font-semibold text-influencer"
                    >
                      {socialMedia.socialMedia?.name}
                    </Link>
                    <div>{helper.formatNumber(socialMedia.followers)}</div>
                  </div>
                );
              })}
            </div>
            <div className="text-3xl font-bold lg:text-4xl">
              {profile?.name}
            </div>
            <div className="text-lg text-gray2">
              {profile?.country}, {profile?.city}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-row items-start  justify-end gap-4 lg:flex-row">
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
      <div className="flex flex-1 flex-col-reverse gap-6 lg:flex-row">
        <div className="flex flex-col gap-6">
          <PictureCarrosel
            visual={true}
            portfolio={
              (profile?.portfolio &&
                profile?.portfolio.map((picture) => {
                  return { id: picture.id, url: picture.url };
                })) ||
              []
            }
          />
          <div className="flex flex-1 flex-col gap-4">
            <div className="text-2xl font-semibold">Categories</div>
            <div className="flex flex-wrap gap-4">
              {profile?.categories.map((category) => {
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
          <div className="flex flex-col gap-4 sm:hidden">
            {profile?.user?.role?.name === "Influencer" &&
              renderValuePackChooser()}
            {profile?.user?.role?.name === "Brand" && renderCampaigns()}
          </div>
        </div>

        <div className="flex-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-semibold">About</div>
            <div className="text-gray2 [overflow-wrap:anywhere]">
              {profile?.about}
            </div>
          </div>
          <div className="hidden flex-col gap-4 sm:flex">
            {profile?.user?.role?.name === "Influencer" &&
              renderValuePackChooser()}
            {profile?.user?.role?.name === "Brand" && renderCampaigns()}
          </div>
        </div>
      </div>
    );
  };

  const renderValuePackChooser = () => {
    return (
      <>
        <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-white1 p-4 shadow-xl">
          <div className="flex flex-1 justify-between">
            <div className="flex items-center gap-1">
              {selectedValuePack.id !== -1 && (
                <div className="text-xl font-medium">
                  {selectedValuePack.valuePackPrice}€
                </div>
              )}
            </div>
            {profileReviews && profileReviews?.length > 0 && (
              <div className="flex flex-1 flex-col items-end justify-end gap-2 xs:flex-row xs:items-center">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="fa-lg cursor-pointer pb-1"
                  />
                  <div>{profile?.rating}</div>
                </div>
                <div className="hidden h-2 w-2 rounded-full bg-black xs:block" />
                <div className="text-gray2">
                  {profileReviews?.length} Reviews
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-[1px] border-white1">
            <div className="flex flex-col pt-4">
              <div className="px-4 text-sm font-semibold">Platform</div>

              <CustomSelect
                name="platform"
                noBorder
                placeholder="Select the social media platform"
                options={availablePlatforms}
                handleOptionSelect={setPlatform}
                value={platform}
              />
            </div>
            <div className="w-full border-[1px] border-white1" />
            {profileValuePack && (
              <ValuePackInput
                allValuePacks={profileValuePack?.map((valuePack) => {
                  return {
                    deliveryTime: valuePack.deliveryTime,
                    description: valuePack.description,
                    numberOfRevisions: valuePack.numberOfRevisions,
                    platform: {
                      id: valuePack.socialMedia?.id || -1,
                      name: valuePack.socialMedia?.name || "",
                    },
                    title: valuePack.title,
                    valuePackPrice: valuePack.valuePackPrice,
                    id: valuePack.id || -1,
                  };
                })}
                onChangeValuePack={setSelectedValuePack}
                valuePack={selectedValuePack}
                platform={platform}
              />
            )}
          </div>
          <Button
            title="Start Order"
            level="primary"
            size="large"
            disabled={platform.id === -1 || selectedValuePack.id === -1}
          />
          <div className="flex items-center justify-center gap-2 text-gray2">
            <ToolTip content="We hold the payment for 72 hours. If the influencer doesn’t accept the order it will automatically be cancelled and your payments refunded" />
            <div>We only charge when the order is complete</div>
          </div>
          <div className="flex flex-col gap-4 text-lg">
            <div className="flex flex-col gap-2">
              <div className="flex flex-1 justify-between">
                <div>Subtotal</div>
                {selectedValuePack.id !== -1 ? (
                  <div>
                    {helper.formatNumber(selectedValuePack.valuePackPrice)}€
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex flex-1 justify-between">
                <div>Fee</div>
                {selectedValuePack.id !== -1 ? (
                  <div>
                    {helper.formatNumber(
                      selectedValuePack.valuePackPrice * 0.1
                    )}
                    €
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="w-full border-[1px] border-white1" />
            <div className="flex flex-1 justify-between font-semibold">
              <div>Total</div>
              {selectedValuePack.id !== -1 ? (
                <div>
                  {helper.formatNumber(
                    selectedValuePack.valuePackPrice +
                      selectedValuePack.valuePackPrice * 0.1
                  )}
                  €
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer text-center underline"
          onClick={() => setIsCustomValuePackModalOpen(true)}
        >
          Request a custom value pack
        </div>
      </>
    );
  };

  const renderCampaigns = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-semibold">Campaigns</div>
        <div className="flex justify-center">There is no campaign history</div>
      </div>
    );
  };

  const renderReviews = () => {
    if (profileReviews && profileReviews?.length > 0) {
      return (
        <>
          <div className="w-full border-[1px] border-gray3" />
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faStar}
                  className="fa-lg cursor-pointer pb-1"
                />
                <div>{profile?.rating ? profile?.rating : ""}</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-black" />
              <div className="text-gray2">
                {profileReviews && profileReviews?.length > 0 ? (
                  <div>{profileReviews?.length} reviews</div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-12">
              {profileReviews.map((review) => {
                return (
                  <Review
                    key={review.id}
                    review={{
                      profilePicture:
                        review.author?.profile?.profilePicture || "",
                      authorName: review.author?.profile?.name || "",
                      review: review.userReview,
                      reviewDate: review.date.toLocaleDateString(),
                    }}
                    isModal={false}
                    onClick={openReviewModal}
                  />
                );
              })}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-2/4">
          {renderHeader()}
          {renderMiddleContent()}
          {renderReviews()}
        </div>
        {isCustomValuePackModalOpen && (
          <RequestCustomValuePackModal
            availablePlatforms={availablePlatforms}
            onClose={() => setIsCustomValuePackModalOpen(false)}
          />
        )}
        {isReviewModalOpen && (
          <Modal onClose={closeReviewModal}>
            <div className="p-4 sm:w-full sm:px-8">
              <Review
                review={{
                  profilePicture: selectedReview?.profilePicture || "",
                  authorName: selectedReview?.authorName || "",
                  review: selectedReview?.review || "",
                  reviewDate: selectedReview?.reviewDate || "",
                }}
                isModal={true}
                onClick={openReviewModal}
              />
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export { PublicProfilePage };
