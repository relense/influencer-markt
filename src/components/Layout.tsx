import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactElement } from "react";
import { api } from "~/utils/api";

import { useSession } from "next-auth/react";
import { BottomBar } from "./BottomBar";
import { Footer } from "./Footer";
import { LoadingSpinner } from "./LoadingSpinner";
import { LoginModal } from "./LoginModal";
import { Navbar } from "./Navbar";
import { CookiePolicy } from "./CookiePolicy";

export const Layout = (props: {
  children: (params: {
    openLoginModal: () => void;
    loggedInProfileId: string;
    scrollLayoutToPreviousPosition: () => void;
    saveScrollPosition: () => void;
    isBrand: boolean;
  }) => ReactElement;
}) => {
  const pathname = usePathname();
  const { data: sessionData, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [layoutScrollPosition, setLayoutScrollPosition] = useState<number>(0);
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
    if (document.scrollingElement) {
      document.scrollingElement?.scrollTo(0, 0);
    } else {
      document.body?.scrollTo(0, 0);
    }
  }, [pathname]);

  const scrollLayoutToPreviousPosition = () => {
    if (document.scrollingElement) {
      document.scrollingElement?.scrollTo(0, layoutScrollPosition);
    } else {
      document.body?.scrollTo(0, layoutScrollPosition);
    }
  };

  const saveScrollPosition = () => {
    if (document.scrollingElement) {
      setLayoutScrollPosition(document.scrollingElement?.scrollTop);
    } else {
      setLayoutScrollPosition(document.body?.scrollTop);
    }
  };

  // if (status === "loading" || (userIsLoading && status === "authenticated")) {
  //   return <LoadingSpinner />;
  // } else {
  return (
    <main className="lg:flex lg:h-screen lg:w-full lg:flex-1 lg:flex-col">
      <Navbar
        username={user?.username || ""}
        role={user?.role || { id: -1, name: "" }}
        sessionData={sessionData}
        openLoginModal={() => setIsModalOpen(true)}
        setIsSignUp={setIsSignUp}
        loggedInProfileId={user?.profile?.id ? user.profile.id : ""}
      />
      <div className="mb-12 flex w-full flex-1 flex-col overflow-y-auto sm:mb-0">
        <div className="flex flex-1 flex-col pb-16">
          {props.children({
            openLoginModal: () => setIsModalOpen(true),
            scrollLayoutToPreviousPosition: () =>
              scrollLayoutToPreviousPosition(),
            saveScrollPosition: () => saveScrollPosition(),
            loggedInProfileId: user?.profile?.id ? user.profile.id : "",
            isBrand: user?.role?.id === 1 ? true : false,
          })}
        </div>
        <Footer />
      </div>
      <BottomBar
        status={status}
        username={user?.username || ""}
        loggedInProfileId={user?.profile?.id ? user.profile.id : ""}
      />
      <div className="flex justify-center">
        {isModalOpen && (
          <LoginModal onClose={() => onCloseModal()} isSignUp={isSignUp} />
        )}
      </div>
      <CookiePolicy />
    </main>
  );
};
