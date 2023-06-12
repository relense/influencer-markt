import type { PropsWithChildren } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen min-w-fit flex-col justify-center">
      <div className="flex h-full w-full flex-col items-center">
        <Navbar />
        <div className="flex h-full w-full flex-col items-center">
          {props.children}
        </div>
        <Footer />
      </div>
    </main>
  );
};
