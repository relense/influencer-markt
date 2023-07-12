import { api } from "~/utils/api";

import { SearchBar } from "../../components/SearchBar";
import { ProfileCard } from "../../components/ProfileCard";
import { helper } from "../../utils/helper";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const ExplorePage = () => {
  const { data: profiles, isLoading } =
    api.profiles.getAllInfluencerProfiles.useQuery();

  const renderInfluencers = () => {
    return (
      <>
        <div className="font-medium">
          {helper.formatNumber(profiles?.[0] || 0)} Influencers
        </div>
        <div className="flex flex-1 flex-wrap gap-16">
          {profiles?.[1].map((profile) => {
            return (
              <ProfileCard
                key={profile.id}
                about={profile.about}
                city={profile.city}
                country={profile.country}
                name={profile.name}
                profilePicture={profile.profilePicture}
                socialMedia={profile.userSocialMedia.map((socialMedia) => {
                  return {
                    followers: socialMedia.followers,
                    handler: socialMedia.handler,
                    id: socialMedia.id,
                    socialMediaName: socialMedia.socialMedia?.name || "",
                    url: socialMedia.url,
                  };
                })}
                username={profile.user.username || ""}
                valuePacks={profile.valuePacks}
              />
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-1 flex-col  gap-6 p-4 xl:w-3/4 xl:self-center 2xl:w-2/4">
      <div className="flex flex-1 justify-center">
        <SearchBar />
      </div>
      {isLoading ? (
        <div className="relative flex flex-1">
          <LoadingSpinner />
        </div>
      ) : (
        renderInfluencers()
      )}
    </div>
  );
};

export { ExplorePage };
