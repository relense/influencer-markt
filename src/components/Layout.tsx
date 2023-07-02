import { useState, type PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useSession } from "next-auth/react";
import { LoginModal } from "./LoginModal";
import { BottomBar } from "./BottomBar";

export const Layout = (props: PropsWithChildren) => {
  const { data: sessionData } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
  };

  return (
    <>
      <main className="flex h-screen w-full flex-1 flex-col">
        <Navbar
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