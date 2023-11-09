import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import { Modal } from "./Modal";
import { Button } from "./Button";

const LoginModal = ({
  onClose,
  isSignUp,
}: {
  onClose: () => void;
  isSignUp: boolean;
}) => {
  const { t, i18n } = useTranslation();

  const [userEmail, setUserEmail] = useState<string>("");
  const [currentSignUp, setCurrentSignUp] = useState<boolean>(isSignUp);

  const title = currentSignUp
    ? t("components.loginModal.signupButton")
    : t("components.loginModal.signinButton");

  const renderLoginWithEmail = () => {
    return (
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
    );
  };

  const loginWithOthers = () => {
    return (
      <div className="flex w-full flex-col gap-4">
        <button
          className="flex h-10 w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-[1px] border-gray3 py-3 pr-6 text-center  lg:rounded-2xl"
          onClick={() =>
            signIn("google", {
              callbackUrl: `${
                process.env.NEXTAUTH_URL || ""
              }/login-callback?returnTo=${
                window.location.pathname
              }&userLanguage=${i18n.language}`,
            })
          }
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
            {currentSignUp
              ? `${t("components.loginModal.signUpWith")} Google`
              : `${t("components.loginModal.signInWith")} Google`}
          </div>
        </button>
      </div>
    );
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex h-full w-full flex-1 flex-col items-center gap-4 px-12 py-4">
        <h1 className="cursor-pointer text-left font-lobster text-2xl text-influencer lg:text-4xl">
          Influencer Markt
        </h1>

        {loginWithOthers()}
        <div className="flex w-full flex-1 items-center gap-4">
          <div className="h-[1px] w-full border-[1px] border-gray3" />
          <div className="flex-2 flex w-full justify-center text-center">
            {currentSignUp ? (
              <div className="flex w-full flex-1 justify-center text-center text-gray2">
                {t("components.loginModal.orSingUp")}
              </div>
            ) : (
              <div className="flex w-full justify-center text-gray2">
                {t("components.loginModal.orLogin")}
              </div>
            )}
          </div>
          <div className="h-[1px] w-full border-[1px] border-gray3" />
        </div>
        {renderLoginWithEmail()}
        {currentSignUp && (
          <div className="text-center text-sm font-medium text-gray2">
            {t("components.loginModal.signUpAgreement")}{" "}
            <Link
              href="/terms-conditions"
              className="cursor-pointer text-black"
            >
              {t("components.loginModal.termsLink")}
            </Link>{" "}
            {t("components.loginModal.and")}{" "}
            <Link href="/privacy-policy" className="cursor-pointer text-black">
              {t("components.loginModal.privacyLink")}
            </Link>
            .
          </div>
        )}
        {!currentSignUp && (
          <span className="text-center text-sm font-medium text-gray2">
            {t("components.loginModal.dontHaveAccount")}{" "}
            <span
              className="cursor-pointer font-semibold text-black underline"
              onClick={() => setCurrentSignUp(true)}
            >
              {t("components.loginModal.signUp")}
            </span>
          </span>
        )}
      </div>
    </Modal>
  );
};

export { LoginModal };
