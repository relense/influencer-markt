import type { PropsWithChildren } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen  flex-col justify-center">
      <div className="flex h-full w-full flex-col items-center">
        <Navbar />
        {props.children}
        <Footer />
      </div>
    </main>
  );
};
