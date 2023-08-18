import { usePathname } from "next/navigation";
import { useEffect, type ReactElement } from "react";
import { api } from "~/utils/api";

import { useSession } from "next-auth/react";
import { BottomBar } from "./BottomBar";

import { LoadingSpinner } from "./LoadingSpinner";
import { AdminNavbar } from "./AdminNavbar";

export const AdminLayout = (props: { children: ReactElement }) => {
  const pathname = usePathname();
  const { data: sessionData, status } = useSession();
  const {
    data: user,
    refetch: refetechUser,
    isLoading: userIsLoading,
  } = api.users.getUser.useQuery(undefined, {
    enabled: false,
  });

  useEffect(() => {
    if (status === "authenticated") {
      void refetechUser();
    }
  }, [refetechUser, status]);

  if (status === "loading" || (userIsLoading && status === "authenticated")) {
    return <LoadingSpinner />;
  } else {
    return (
      <main className="flex h-screen w-full flex-1 flex-col">
        <AdminNavbar />
        <div className="mb-12 flex w-full flex-1 flex-col overflow-y-auto sm:mb-0">
          <div className="flex flex-1 flex-col">{props.children}</div>
        </div>
        <BottomBar status={status} username={user?.username || ""} />
      </main>
    );
  }
};
