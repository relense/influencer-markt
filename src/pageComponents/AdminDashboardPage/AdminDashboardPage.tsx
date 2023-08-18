import Link from "next/link";
import { api } from "~/utils/api";

const AdminDashboardPage = () => {
  const { data: influencers } = api.profiles.getAllInfluencerProfiles.useQuery({
    socialMedia: [],
    categories: [],
    gender: -1,
    minFollowers: -1,
    maxFollowers: -1,
    minPrice: -1,
    maxPrice: -1,
    country: -1,
    city: -1,
    contentTypeId: -1,
  });

  const { data: brands } = api.profiles.getAllBrandsProfiles.useQuery({
    socialMedia: [],
    categories: [],
    minFollowers: -1,
    maxFollowers: -1,
    country: -1,
    city: -1,
  });
  // const { data: messages } = [];

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div>
        <Link
          href="/admin/influencers"
          className="cursor-pointer text-2xl hover:underline"
        >
          Influencers
        </Link>
      </div>

      <div className="w-full border-[1px] border-white1" />

      <div>
        <Link
          href="/admin/brands"
          className="cursor-pointer text-2xl hover:underline"
        >
          Brands
        </Link>
      </div>

      <div className="w-full border-[1px] border-white1" />

      <div>
        <Link
          href="/admin/messages"
          className="cursor-pointer text-2xl hover:underline"
        >
          Messages
        </Link>
      </div>
    </div>
  );
};

export { AdminDashboardPage };
