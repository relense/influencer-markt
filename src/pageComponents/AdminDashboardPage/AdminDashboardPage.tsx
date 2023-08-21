import { useState } from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";

import { ProfileData } from "./innerComponents/ProfileData";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const AdminDashboardPage = () => {
  const [showInfluencers, setShowInfluencers] = useState<boolean>(false);
  const [showBrands, setShowBrands] = useState<boolean>(false);
  const [showMessages, setShowMessages] = useState<boolean>(false);

  const { data: influencers, isLoading: isLoadingInfluencers } =
    api.profiles.getAllProfileForAdminDashboard.useQuery(
      {
        roleId: 2,
      },
      {
        cacheTime: 0,
      }
    );

  const { data: brands, isLoading: isLoadingBrands } =
    api.profiles.getAllProfileForAdminDashboard.useQuery(
      {
        roleId: 1,
      },
      {
        cacheTime: 0,
      }
    );

  // const { data: messages } = [];

  const renderInfluencers = () => {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="flex cursor-pointer items-center justify-between gap-4"
          onClick={() => setShowInfluencers(!showInfluencers)}
        >
          <Link
            href="/admin/influencers"
            className="cursor-pointer text-xl hover:underline"
          >
            Influencers
          </Link>
          <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
            <div>
              {showInfluencers ? (
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
        {showInfluencers && (
          <div className="flex flex-col gap-4">
            {influencers &&
              influencers.map((influencer) => {
                return <ProfileData key={influencer.id} profile={influencer} />;
              })}
          </div>
        )}
      </div>
    );
  };

  const renderBrands = () => {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="flex cursor-pointer items-center justify-between gap-4"
          onClick={() => setShowBrands(!showBrands)}
        >
          <Link
            href="/admin/brands"
            className="cursor-pointer text-xl hover:underline"
          >
            Brands
          </Link>
          <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
            <div>
              {showBrands ? (
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
        {showBrands && (
          <div className="flex flex-col gap-4">
            {brands &&
              brands.map((influencer) => {
                return <ProfileData key={influencer.id} profile={influencer} />;
              })}
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="flex cursor-pointer items-center justify-between gap-4"
          onClick={() => setShowMessages(!showMessages)}
        >
          <Link
            href="/admin/messages"
            className="cursor-pointer text-xl hover:underline"
          >
            Messages
          </Link>
          <div className="flex h-6 w-6 justify-center rounded-full border-[1px]">
            <div>
              {showMessages ? (
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
        {showMessages && <div className="flex flex-col gap-4"></div>}
      </div>
    );
  };

  if (isLoadingInfluencers || isLoadingBrands) {
    return (
      <div className="flex w-full flex-1 cursor-default flex-col justify-center gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        <div className="relative h-[50vh] lg:flex lg:h-full lg:flex-1">
          <LoadingSpinner />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
        {renderInfluencers()}
        <div className="w-full border-[1px] border-white1" />
        {renderBrands()}
        <div className="w-full border-[1px] border-white1" />
        {renderMessages()}
      </div>
    );
  }
};

export { AdminDashboardPage };
