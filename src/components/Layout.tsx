import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { api } from "~/utils/api";

import { useSession } from "next-auth/react";
import { BottomBar } from "./BottomBar";
import { type Option } from "./CustomMultiSelect";
import { Footer } from "./Footer";
import { LoadingSpinner } from "./LoadingSpinner";
import { LoginModal } from "./LoginModal";
import { Navbar } from "./Navbar";

export const Layout = (props: PropsWithChildren) => {
  const pathname = usePathname();
  const { data: sessionData, status } = useSession();
  const scrollableContainer = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
  };

  useEffect(() => {
    if (scrollableContainer && scrollableContainer.current) {
      scrollableContainer.current?.scrollTo(0, 0);
    }
  }, [pathname]);

  const renderAppLayout = (username: string, role: Option) => {
    return (
      <>
        <main className="flex h-screen w-full flex-1 flex-col">
          <Navbar
            username={username}
            role={role}
            sessionData={sessionData}
            openLoginModal={() => setIsModalOpen(true)}
            setIsSignUp={setIsSignUp}
          />
          <div
            className="mb-12 flex w-full flex-1 flex-col overflow-y-auto sm:mb-0"
            ref={scrollableContainer}
          >
            <div className="flex flex-1 flex-col">{props.children}</div>
            <Footer />
          </div>
          <BottomBar />
          <div className="flex justify-center">
            {isModalOpen && (
              <LoginModal onClose={() => onCloseModal()} isSignUp={isSignUp} />
            )}
          </div>
        </main>
      </>
    );
  };

  if (status === "authenticated") {
    const { data: user, isLoading } = api.users.getUser.useQuery();
    if (isLoading) {
      return <LoadingSpinner />;
    } else {
      return renderAppLayout(user?.username || "", {
        id: user?.role?.id || -1,
        name: user?.role?.name || "",
      });
    }
  } else {
    return renderAppLayout("", { id: -1, name: "" });
  }
};
