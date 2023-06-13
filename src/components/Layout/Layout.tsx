import type { PropsWithChildren } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen w-full flex-1 flex-col">
      <Navbar />
      <div className="flex w-full flex-col">{props.children}</div>
      <Footer />
    </main>
  );
};
