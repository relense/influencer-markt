import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { api } from "~/utils/api";

import { useSession } from "next-auth/react";
import { BottomBar } from "./BottomBar";
import { Footer } from "./Footer";
import { LoadingSpinner } from "./LoadingSpinner";
import { LoginModal } from "./LoginModal";
import { Navbar } from "./Navbar";

export const Layout = (props: {
  children: (params: {
    openLoginModal: () => void;
    loggedInProfileId: number;
  }) => ReactElement;
}) => {
  const pathname = usePathname();
  const { data: sessionData, status } = useSession();
  const scrollableContainer = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const {
    data: user,
    refetch: refetechUser,
    isLoading: userIsLoading,
  } = api.users.getUser.useQuery(undefined, {
    enabled: false,
  });

  const onCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      void refetechUser();
    }
  }, [refetechUser, status]);

  useEffect(() => {
    if (scrollableContainer && scrollableContainer.current) {
      scrollableContainer.current?.scrollTo(0, 0);
    }
  }, [pathname]);

  if (status === "loading" || (userIsLoading && status === "authenticated")) {
    return <LoadingSpinner />;
  } else {
    return (
      <main className="flex h-screen w-full flex-1 flex-col">
        <Navbar
          username={user?.username || ""}
          role={user?.role || { id: -1, name: "" }}
          sessionData={sessionData}
          openLoginModal={() => setIsModalOpen(true)}
          setIsSignUp={setIsSignUp}
        />
        <div
          className="mb-12 flex w-full flex-1 flex-col overflow-y-auto sm:mb-0"
          ref={scrollableContainer}
        >
          <div className="flex flex-1 flex-col">
            {props.children({
              openLoginModal: () => setIsModalOpen(true),
              loggedInProfileId: user?.profile?.id ? user.profile.id : -1,
            })}
          </div>
          <Footer />
        </div>
        <BottomBar status={status} />
        <div className="flex justify-center">
          {isModalOpen && (
            <LoginModal onClose={() => onCloseModal()} isSignUp={isSignUp} />
          )}
        </div>
      </main>
    );
  }
};
