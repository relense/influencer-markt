import { api } from "~/utils/api";

import { SearchBar } from "../../components/SearchBar";

const ExplorePage = () => {
  const { data: profiles } = api.profiles.getAllInfluencerProfiles.useQuery();

  return (
    <div className="flex flex-1 flex-col  gap-16 p-4 xl:w-3/4 xl:self-center 2xl:w-2/4">
      <div className="flex flex-1 justify-center">
        <SearchBar />
      </div>
      <div>
        {profiles?.map((profile) => {
          return <div key={profile.id}></div>;
        })}
      </div>
    </div>
  );
};

export { ExplorePage };
