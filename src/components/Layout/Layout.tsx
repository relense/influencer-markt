import { useState, type PropsWithChildren, useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { useSession } from "next-auth/react";

type LayoutState = { status: "Loading" } | { status: "Loaded" };

export const Layout = (props: PropsWithChildren) => {
  const [state, setState] = useState<LayoutState>({
    status: "Loading",
  });
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (sessionData) {
      setState({ status: "Loaded" });
    } else {
      setState({ status: "Loaded" });
    }
  }, [sessionData]);

  if (state.status === "Loading") {
    return <div>Loading</div>;
  } else if (state.status === "Loaded")
    return (
      <main className="flex h-screen w-full flex-1 flex-col">
        <Navbar sessionData={sessionData} />
        <div className="flex w-full flex-col">{props.children}</div>
        <Footer />
      </main>
    );
};
