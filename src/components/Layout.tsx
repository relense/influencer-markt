import { useState, type PropsWithChildren } from "react";
import { api } from "~/utils/api";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useSession } from "next-auth/react";
import { LoginModal } from "./LoginModal";
import { BottomBar } from "./BottomBar";
import { type Option } from "./CustomMultiSelect";

export const Layout = (props: PropsWithChildren) => {
  const { data: sessionData, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
  };

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
          <div className="mb-12 flex w-full flex-1 flex-col overflow-y-auto sm:mb-0">
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
      return <div>Loading</div>;
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
