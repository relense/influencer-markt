import { useState, type PropsWithChildren } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { useSession } from "next-auth/react";
import { LoginModal } from "../LoginModal/LoginModal";

export const Layout = (props: PropsWithChildren) => {
  const { data: sessionData } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <main className="flex h-screen w-full flex-1 flex-col">
        <Navbar
          sessionData={sessionData}
          openLoginModal={() => setIsModalOpen(true)}
        />
        <div className="flex w-full flex-col">{props.children}</div>
        <Footer />
      </main>
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
