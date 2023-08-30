import { type ReactElement } from "react";

import { useSession } from "next-auth/react";

import { LoadingSpinner } from "./LoadingSpinner";
import { AdminNavbar } from "./AdminNavbar";

export const AdminLayout = (props: { children: ReactElement }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <LoadingSpinner />;
  } else {
    return (
      <main className="flex h-screen w-full flex-1 flex-col">
        <AdminNavbar />
        <div className="mb-12 flex w-full flex-1 flex-col overflow-y-auto sm:mb-0">
          <div className="flex flex-1 flex-col">{props.children}</div>
        </div>
      </main>
    );
  }
};
