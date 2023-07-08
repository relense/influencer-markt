import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faBell,
  faFileLines,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
  faChevronDown,
  faChevronUp,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "./Button";
import { type Option } from "./CustomMultiSelect";

export const Navbar = (params: {
  username: string;
  role: Option | undefined;
  sessionData: Session | null;
  openLoginModal: () => void;
  setIsSignUp: (isSignUp: boolean) => void;
}) => {
  const { t } = useTranslation();

  const [toggleHamburguer, setToggleHamburguer] = useState<boolean>(false);
  const [toggleOptions, setToggleOptions] = useState<boolean>(false);

  const handleJoinMarketplace = () => {
    params.setIsSignUp(true);
    params.openLoginModal();
  };

  const leftNavBar = () => {
    return (
      <div className="flex flex-1 justify-start">
        <Link href="/" className="cursor-pointer text-lg lg:p-2">
          {t("components.navbar.home")}
        </Link>
        <Link href="/explore" className="cursor-pointer text-lg lg:p-2">
          {t("components.navbar.explore")}
          {params.sessionData && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className="fa-sm cursor-pointer px-5"
            />
          )}
        </Link>
        {params.sessionData && (
          <span className="cursor-pointer text-lg lg:p-2">
            {t("components.navbar.saved")}
            <FontAwesomeIcon
              icon={faChevronDown}
              className="fa-sm cursor-pointer px-5"
            />
          </span>
        )}
      </div>
    );
  };

  const rightNavbar = () => {
    return (
      <>
        {!params.sessionData && (
          <div className="flex flex-row items-center justify-end">
            <span
              className="cursor-pointer text-lg lg:p-2"
              onClick={() => params.openLoginModal()}
            >
              {t("components.navbar.signIn")}
            </span>
            <Button
              title={t("components.navbar.joinMarketPlace")}
              level="primary"
              onClick={() => handleJoinMarketplace()}
            />
          </div>
        )}
        {params.sessionData && (
          <div className="flex flex-row items-center justify-end gap-8">
            <FontAwesomeIcon
              icon={faMessage}
              className="fa-xl cursor-pointer"
            />
            <FontAwesomeIcon icon={faBell} className="fa-xl cursor-pointer" />
            <div>
              <FontAwesomeIcon
                icon={!toggleOptions ? faChevronDown : faChevronUp}
                className="fa-lg cursor-pointer"
                onClick={() => setToggleOptions(!toggleOptions)}
              />
              {toggleOptions && optionsDropDownMenu()}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderLogoTitle = () => {
    return (
      <Link href="/">
        <h1 className="m-0 cursor-pointer text-left font-lobster text-2xl text-influencer lg:text-4xl">
          Influencer Markt
        </h1>
      </Link>
    );
  };

  const renderHamburguerMenu = () => {
    return (
      <div className="flex">
        <FontAwesomeIcon
          icon={faBars}
          className="fa-xl cursor-pointer"
          onClick={() => setToggleHamburguer(!toggleHamburguer)}
        />
        {toggleHamburguer && hamburguerDropDownMenu()}
      </div>
    );
  };

  const hamburguerDropDownMenu = () => {
    return (
      <>
        <div
          className="absolute left-0 top-0 h-screen w-screen"
          onClick={() => setToggleHamburguer(!toggleHamburguer)}
        />
        <div
          className="absolute right-1 top-10 z-10 flex h-auto w-11/12 flex-col gap-4 rounded-2xl border-[1px] border-white1 bg-white p-8 shadow-lg sm:right-5 sm:w-72"
          onClick={() => setToggleHamburguer(!toggleHamburguer)}
        >
          {!params.sessionData && (
            <>
              <div className="flex cursor-pointer items-center gap-6">
                <Button
                  title="Join Marketplace"
                  level="primary"
                  onClick={() => handleJoinMarketplace()}
                />
              </div>
              <div className="border-[1px] border-white1" />
              <div
                className="flex items-center gap-4"
                onClick={() => params.openLoginModal()}
              >
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="fa-xl cursor-pointer"
                />
                <span className="cursor-pointer text-lg lg:p-2">
                  {t("components.navbar.signIn")}
                </span>
              </div>
            </>
          )}
          {params.sessionData && (
            <>
              {params.role && params.role.name !== "Individual" && (
                <>
                  <Link
                    href={params.username ? `/${params.username}` : "/"}
                    className="flex cursor-pointer gap-4"
                  >
                    <FontAwesomeIcon
                      icon={faFileLines}
                      className="fa-xl cursor-pointer"
                    />
                    {t("components.navbar.myPage")}
                  </Link>
                  <Link
                    href={`/${params.username}/edit`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPencil} className="fa-lg" />

                    <div>{t("components.navbar.editMyPage")}</div>
                  </Link>
                  <div className="border-[1px] border-white1" />
                </>
              )}

              <div
                className="flex items-center gap-4"
                onClick={() => void signOut()}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="fa-xl cursor-pointer"
                />
                <span
                  className="cursor-pointer text-lg"
                  onClick={() => void signOut()}
                >
                  {t("components.navbar.signOut")}
                </span>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const optionsDropDownMenu = () => {
    return (
      <>
        <div
          className="absolute left-0 top-0 h-screen w-screen"
          onClick={() => setToggleOptions(!toggleOptions)}
        />
        <div
          className="absolute right-1 top-20 z-10 flex h-auto w-11/12 flex-col gap-4 rounded-2xl border-[1px] border-white1 bg-white p-8 shadow-lg sm:right-5 sm:w-auto"
          onClick={() => setToggleOptions(!toggleOptions)}
        >
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faUserCircle} className="fa-xl" />
            <div>{params.sessionData?.user.email}</div>
          </div>
          <div className="cursor-pointer border-[1px] border-white1" />

          {params.role && params.role.name !== "Individual" && (
            <>
              <Link
                href={params.username ? `/${params.username}` : "/"}
                className="flex cursor-pointer gap-4"
              >
                <FontAwesomeIcon
                  icon={faFileLines}
                  className="fa-xl cursor-pointer"
                />
                <div className="hover:underline">
                  {t("components.navbar.myPage")}
                </div>
              </Link>

              <Link
                href={`/${params.username}/edit`}
                className="flex cursor-pointer items-center gap-2"
              >
                <FontAwesomeIcon icon={faPencil} className="fa-lg" />

                <div className="hover:underline">
                  {t("components.navbar.editMyPage")}
                </div>
              </Link>

              <div className="cursor-pointer border-[1px] border-white1" />
            </>
          )}
          <div
            className="flex cursor-pointer items-center gap-4"
            onClick={() => void signOut()}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="fa-xl" />
            <span
              className="text-lg hover:underline"
              onClick={() => void signOut()}
            >
              {t("components.navbar.signOut")}
            </span>
          </div>
        </div>
      </>
    );
  };

  const renderDesktopMenu = () => {
    return (
      <div className="hidden h-16 w-full items-center px-6 py-12 lg:flex lg:gap-4 lg:px-12">
        {renderLogoTitle()}
        {leftNavBar()}
        {rightNavbar()}
      </div>
    );
  };
  const renderMobileMenu = () => {
    return (
      <div className="flex items-center justify-between px-4 py-2 lg:hidden">
        {renderLogoTitle()} {renderHamburguerMenu()}
      </div>
    );
  };

  return (
    <nav>
      {renderDesktopMenu()}
      {renderMobileMenu()}
    </nav>
  );
};
