import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Modal } from "./Modal";
import { Button } from "./Button";

const LoginModal = ({
  onClose,
  isSignUp,
}: {
  onClose: () => void;
  isSignUp: boolean;
}) => {
  const [userEmail, setUserEmail] = useState<string>("");
  const { t, i18n } = useTranslation();

  const title = isSignUp
    ? t("components.loginModal.signupButton")
    : t("components.loginModal.signinButton");

  return (
    <Modal onClose={onClose}>
      <div className="flex h-full w-full flex-1 flex-col items-center gap-4 px-12 py-4">
        <h1 className="cursor-pointer text-left font-lobster text-2xl text-influencer lg:text-4xl">
          Influencer Markt
        </h1>

        <form className="flex w-full flex-col gap-4">
          <input
            type="email"
            className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
            placeholder="Email"
            autoComplete="off"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <Button
            title={title}
            level="primary"
            size="large"
            onClick={(e) => {
              e.preventDefault();

              void signIn("email", {
                email: `${userEmail}`,
                callbackUrl: `/login-callback?returnTo=${window.location.pathname}&userLanguage=${i18n.language}`,
              });
            }}
          />
        </form>
        <div className="flex w-full flex-1 items-center gap-6">
          <div className="h-[1px] w-full border-[1px] border-gray3" />
          <div>{t("components.loginModal.or")}</div>
          <div className="h-[1px] w-full border-[1px] border-gray3" />
        </div>
        <div className="flex flex-col gap-4">
          <button
            className="flex h-10 w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-[1px] border-gray3 py-3 pr-6 text-center hover:bg-influencer-green-super-light lg:rounded-2xl"
            onClick={() => signIn("google")}
          >
            <div className="py-2 pl-2 pr-6">
              <Image
                src={`/images/google.svg`}
                height={32}
                width={32}
                alt="google logo"
                className="object-contain"
              />
            </div>
            <div className="font-roboto font-medium ">
              {isSignUp
                ? `${t("components.loginModal.signUpWith")} Google`
                : `${t("components.loginModal.signInWith")} Google`}
            </div>
          </button>
          <button
            className="flex h-10 w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-[1px] border-gray3 py-3 pr-6 text-center hover:bg-influencer-green-super-light lg:rounded-2xl"
            onClick={() =>
              signIn("github", {
                callbackUrl: `${
                  process.env.NEXTAUTH_URL || ""
                }/login-callback?returnTo=${window.location.pathname}`,
              })
            }
          >
            <div className="py-2 pl-2 pr-6">
              <Image
                src={`/images/github.svg`}
                height={32}
                width={32}
                alt="google logo"
                className="object-contain"
              />
            </div>
            <div className="font-roboto font-medium ">
              {isSignUp
                ? `${t("components.loginModal.signUpWith")} Github`
                : `${t("components.loginModal.signInWith")} Github`}{" "}
            </div>
          </button>
        </div>
        <div className="text-center text-sm font-medium text-gray2">
          {t("components.loginModal.signUpAgreement")}{" "}
          <Link href="/terms-conditions" className="cursor-pointer text-black">
            {t("components.loginModal.termsLink")}
          </Link>{" "}
          {t("components.loginModal.and")}{" "}
          <Link href="/privacy-policy" className="cursor-pointer text-black">
            {t("components.loginModal.privacyLink")}
          </Link>
          .
        </div>
      </div>
    </Modal>
  );
};

export { LoginModal };
