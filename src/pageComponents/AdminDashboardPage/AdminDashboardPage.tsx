import Link from "next/link";

const AdminDashboardPage = () => {
  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="flex flex-1 flex-col items-center justify-center gap-12 lg:flex-row">
        <Link
          href="/admin/influencers"
          className="cursor-pointer rounded-2xl border-[1px] p-40 text-center font-semibold text-influencer hover:bg-light-red"
        >
          MANAGE INFLUENCERS
        </Link>
        <Link
          href="/admin/brands"
          className="cursor-pointer rounded-2xl border-[1px] p-40 text-center font-semibold text-influencer hover:bg-light-red"
        >
          MANAGE BRANDS
        </Link>
        <Link
          href="/admin/messages"
          className="cursor-pointer rounded-2xl border-[1px] p-40 text-center font-semibold text-influencer hover:bg-light-red"
        >
          MANAGE MESSAGES
        </Link>
      </div>
    </div>
  );
};

export { AdminDashboardPage };
