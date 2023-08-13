import { useRef, useState } from "react";
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
  faBriefcase,
  faChevronDown,
  faChevronUp,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "./Button";
import type { Option } from "../utils/globalTypes";
import { useOutsideClick } from "../utils/helper";

export const Navbar = (params: {
  username: string;
  role: Option | undefined;
  sessionData: Session | null;
  openLoginModal: () => void;
  setIsSignUp: (isSignUp: boolean) => void;
}) => {
  const dropdownWrapperRef = useRef(null);
  const { t } = useTranslation();

  const [toggleOptions, setToggleOptions] = useState<boolean>(false);

  useOutsideClick(() => {
    if (toggleOptions === false) return;

    setToggleOptions(!toggleOptions);
  }, dropdownWrapperRef);

  const handleJoinMarketplace = () => {
    params.setIsSignUp(true);
    params.openLoginModal();
  };

  const leftNavBar = () => {
    return (
      <div className="hidden flex-1 items-center justify-start lg:flex">
        <Link href="/" className="cursor-pointer text-lg lg:px-2">
          {t("components.navbar.home")}
        </Link>

        <div className="group relative flex px-2">
          <div className="flex items-center gap-2">
            <Link
              href="/explore/influencers"
              className="cursor-pointer text-lg"
            >
              {t("components.navbar.explore")}
            </Link>
            {params.sessionData && (
              <>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="fa-sm flex cursor-pointer group-hover:hidden"
                />
                <FontAwesomeIcon
                  icon={faChevronUp}
                  className="fa-sm group hidden cursor-pointer group-hover:flex"
                />
              </>
            )}
          </div>
          {params.sessionData && (
            <div className="absolute left-[-13px] top-7 z-50 hidden flex-col justify-center rounded-lg bg-white shadow-md group-hover:flex">
              <Link
                href="/explore/influencers"
                className="cursor-pointer text-lg"
              >
                <div className="cursor-pointer rounded-t-lg px-8 py-4 hover:bg-influencer-green hover:text-white">
                  {t("components.navbar.influencers")}
                </div>
              </Link>

              <Link
                href="/explore/brands"
                className="hover: cursor-pointer rounded-b-lg px-8 py-4 text-lg hover:bg-influencer-green hover:text-white"
              >
                {t("components.navbar.brands")}
              </Link>
            </div>
          )}
        </div>
        {params.sessionData && (
          <>
            <div className="group relative flex px-2">
              <div className="flex items-center gap-2">
                <Link
                  href="/saved/influencers"
                  className="cursor-pointer text-lg"
                >
                  {t("components.navbar.saved")}
                </Link>
                {params.sessionData && (
                  <>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="fa-sm flex cursor-pointer group-hover:hidden"
                    />
                    <FontAwesomeIcon
                      icon={faChevronUp}
                      className="fa-sm group hidden cursor-pointer group-hover:flex"
                    />
                  </>
                )}
              </div>
              <div className="absolute left-[-13px] top-7 z-50 hidden flex-col justify-center rounded-lg bg-white shadow-md group-hover:flex">
                <Link
                  href="/saved/influencers"
                  className="cursor-pointer text-lg"
                >
                  <div className="cursor-pointer rounded-t-lg px-8 py-4 hover:bg-influencer-green hover:text-white">
                    {t("components.navbar.influencers")}
                  </div>
                </Link>

                <Link
                  href="/saved/brands"
                  className="hover: cursor-pointer px-8 py-4 text-lg hover:bg-influencer-green hover:text-white"
                >
                  {t("components.navbar.brands")}
                </Link>
              </div>
            </div>
          </>
        )}
        <Link href="/offers" className="cursor-pointer px-2 text-lg">
          {t("components.navbar.offers")}
        </Link>
      </div>
    );
  };

  const rightNavbar = () => {
    return (
      <div className="flex">
        {!params.sessionData && (
          <>
            <div className="hidden flex-row items-center justify-end lg:flex">
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
            <div className="flex lg:hidden">
              {renderHamburguerMenuUnauthenticated()}
            </div>
          </>
        )}
        {params.sessionData && (
          <div className="flex flex-row items-center justify-end gap-8">
            <FontAwesomeIcon
              icon={faMessage}
              className="fa-xl cursor-pointer"
            />
            <FontAwesomeIcon icon={faBell} className="fa-xl cursor-pointer" />

            {renderHamburguerMenuAuthenticated()}
          </div>
        )}
      </div>
    );
  };

  const renderLogoTitle = () => {
    return (
      <Link href="/">
        <h1 className="m-0 hidden cursor-pointer text-left font-lobster text-2xl text-influencer xxs:flex lg:text-4xl">
          Influencer Markt
        </h1>
        <h1 className="m-0 flex cursor-pointer text-left font-lobster text-2xl text-influencer xxs:hidden lg:text-4xl">
          IM
        </h1>
      </Link>
    );
  };

  const renderHamburguerMenuAuthenticated = () => {
    return (
      <div className="flex justify-end" ref={dropdownWrapperRef}>
        <FontAwesomeIcon
          icon={faBars}
          className="fa-xl cursor-pointer"
          onClick={() => setToggleOptions(!toggleOptions)}
        />
        {toggleOptions && optionsDropdownAthenticated()}
      </div>
    );
  };

  const renderHamburguerMenuUnauthenticated = () => {
    return (
      <div className="flex justify-end" ref={dropdownWrapperRef}>
        <FontAwesomeIcon
          icon={faBars}
          className="fa-xl cursor-pointer"
          onClick={() => setToggleOptions(!toggleOptions)}
        />
        {toggleOptions && optionDropdownDataUnathenticated()}
      </div>
    );
  };

  const optionDropdownDataUnathenticated = () => {
    if (!params.sessionData) {
      return (
        <>
          <div
            className="absolute left-0 top-0 h-screen w-screen"
            onClick={() => setToggleOptions(!toggleOptions)}
          />
          <div
            className="absolute right-1 top-14 z-50 flex h-auto w-11/12 flex-col gap-4 rounded-2xl border-[1px] border-white1 bg-white p-8 shadow-lg sm:right-5 sm:w-auto lg:top-20"
            onClick={() => setToggleOptions(!toggleOptions)}
          >
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
          </div>
        </>
      );
    }
  };

  const optionsDropdownAthenticated = () => {
    if (params.sessionData) {
      return (
        <>
          <div
            className="absolute left-0 top-0 h-screen w-screen"
            onClick={() => setToggleOptions(!toggleOptions)}
          />
          <div
            className="absolute right-1 top-14 z-50 flex h-auto w-11/12 flex-col gap-4 rounded-2xl border-[1px] border-white1 bg-white p-8 shadow-lg sm:right-5 sm:w-auto lg:top-20"
            onClick={() => setToggleOptions(!toggleOptions)}
          >
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faUserCircle} className="fa-xl" />
              <div>{params.sessionData?.user.email}</div>
            </div>

            <div>
              <div className="cursor-pointer border-[1px] border-white1" />
              <Link
                href={params.username ? `/${params.username}` : "/"}
                className="group flex cursor-pointer gap-4 py-2"
              >
                <FontAwesomeIcon
                  icon={faFileLines}
                  className="fa-xl cursor-pointer"
                />
                <div className="group-hover:underline">
                  {t("components.navbar.myPage")}
                </div>
              </Link>

              <Link
                href={`/${params.username}/edit`}
                className="group flex cursor-pointer items-center gap-4 py-2"
              >
                <FontAwesomeIcon icon={faPencil} className="fa-lg" />

                <div className="group-hover:underline">
                  {t("components.navbar.editMyPage")}
                </div>
              </Link>

              <Link
                href="/my-offers"
                className="group flex cursor-pointer items-center gap-4 py-2"
              >
                <FontAwesomeIcon icon={faBriefcase} className="fa-lg" />

                <div className="group-hover:underline">
                  {t("components.navbar.myOffers")}
                </div>
              </Link>

              <div className="cursor-pointer border-[1px] border-white1" />
            </div>

            <div
              className="group flex cursor-pointer items-center gap-4"
              onClick={() => void signOut()}
            >
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="fa-xl"
              />
              <span
                className="text-lg group-hover:underline"
                onClick={() => void signOut()}
              >
                {t("components.navbar.signOut")}
              </span>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <nav>
      <div className="flex w-full items-center justify-between px-4 py-2 lg:h-16 lg:gap-4 lg:p-12">
        {renderLogoTitle()}
        {leftNavBar()}
        {rightNavbar()}
      </div>
    </nav>
  );
};
