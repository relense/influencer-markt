import { type ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

type CheckUserState = { status: "Loading" } | { status: "Loaded" };

export const CheckUser = (params: { children: ReactElement }) => {
  const [state, setState] = useState<CheckUserState>({
    status: "Loading",
  });
  const { data: userData, isLoading } = api.users.getUser.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userData?.firstSteps === false) {
      void router.push("/first-steps");
    } else if (!userData?.firstSteps === true) {
      setState({
        status: "Loaded",
      });
    }
  }, [isLoading]);

  if (state.status === "Loading") {
    return <div>Loading</div>;
  } else if (state.status === "Loaded") {
    return params.children;
  }
};
