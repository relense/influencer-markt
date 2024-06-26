import { type ReactElement } from "react";
import { TempNavbar } from "./TempNavbar";
import { TempFooter } from "./TempFooter";

export const TempLayout = (props: { children: () => ReactElement }) => {
  return (
    <main className="lg:flex lg:h-screen lg:w-full lg:flex-1 lg:flex-col">
      <TempNavbar />
      <div className="mb-12 flex w-full flex-1 flex-col overflow-y-auto sm:mb-0">
        <div className="flex flex-1 flex-col pb-16">{props.children()}</div>
        <TempFooter />
      </div>
    </main>
  );
};
