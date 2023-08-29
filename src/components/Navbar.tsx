import { useEffect, useRef, useState } from "react";
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
  faAddressCard,
  faEnvelope,
  faCircleQuestion,
  faFolderOpen,
  faLifeRing,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
  faBookmark,
  faBriefcase,
  faChevronDown,
  faChevronUp,
  faGear,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "./Button";
import type { Option } from "../utils/globalTypes";
import { useOutsideClick } from "../utils/helper";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";

export const Navbar = (params: {
  username: string;
  role: Option | undefined;
  sessionData: Session | null;
  openLoginModal: () => void;
  setIsSignUp: (isSignUp: boolean) => void;
}) => {
  const { t } = useTranslation();

  const dropdownWrapperRef = useRef(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [toggleOptions, setToggleOptions] = useState<boolean>(false);
  const [openHelpCenter, setOPenHelpCenter] = useState<boolean>(false);
  const [dropdownHeight, setDropdownHeight] = useState<number>(0);
  const [draggablePositionY, setDraggablePositionY] = useState<number>(0);

  useOutsideClick(() => {
    if (toggleOptions === false) return;

    setToggleOptions(!toggleOptions);
  }, dropdownWrapperRef);

  useEffect(() => {
    if (!drawerRef.current) return;
    setDropdownHeight(drawerRef.current.clientHeight);
  }, [toggleOptions]);

  const handleJoinMarketplace = () => {
    params.setIsSignUp(true);
    params.openLoginModal();
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    if (data.y > dropdownHeight / 2) {
      setToggleOptions(false);
    } else {
      setDraggablePositionY(0);
      setToggleOptions(true);
    }
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    if (data.y < 0) {
      setDraggablePositionY(0);
    }
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
          <div className="flex flex-row items-center justify-end gap-6">
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
          className="fa-xl flex cursor-pointer lg:hidden"
          onClick={() => setToggleOptions(!toggleOptions)}
        />
        {!toggleOptions ? (
          <FontAwesomeIcon
            icon={faChevronDown}
            className="fa-xl hidden cursor-pointer lg:flex"
            onClick={() => setToggleOptions(!toggleOptions)}
          />
        ) : (
          <FontAwesomeIcon
            icon={faChevronUp}
            className="fa-xl hidden cursor-pointer lg:flex"
            onClick={() => setToggleOptions(!toggleOptions)}
          />
        )}
        {toggleOptions && optionsDropdownAuthenticated()}
        {openHelpCenter && navigationHelpers()}
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
        {toggleOptions && optionDropdownDataUnauthenticated()}
        {openHelpCenter && navigationHelpers()}
      </div>
    );
  };

  const optionDropdownDataUnauthenticated = () => {
    if (!params.sessionData) {
      return (
        <>
          <div
            className="absolute left-0 top-0 h-screen w-screen"
            onClick={() => setToggleOptions(!toggleOptions)}
          />
          <div
            className="absolute right-1 top-14 z-50 flex h-auto w-auto flex-col gap-4 rounded-2xl border-[1px] border-white1 bg-white p-8 shadow-lg sm:right-5 lg:top-20"
            onClick={() => setToggleOptions(!toggleOptions)}
          >
            <div className="flex cursor-pointer items-center gap-6">
              <Button
                title={t("components.navbar.joinMarketPlace")}
                level="primary"
                onClick={() => handleJoinMarketplace()}
              />
            </div>
            <div className="border-[1px] border-white1" />
            <div
              className="flex cursor-pointer items-center gap-4 hover:underline"
              onClick={() => params.openLoginModal()}
            >
              <FontAwesomeIcon icon={faArrowRightToBracket} className="fa-lg" />
              <span className="cursor-pointer lg:p-2">
                {t("components.navbar.signIn")}
              </span>
            </div>
            <div className="cursor-pointer border-[1px] border-white1" />
            <div
              className="group flex cursor-pointer items-center gap-4 py-2 sm:hidden"
              onClick={() => setOPenHelpCenter(true)}
            >
              <FontAwesomeIcon icon={faLifeRing} className="fa-lg" />

              <div className="group-hover:underline">
                {t("components.navbar.helpCenter")}
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const optionsDropdownAuthenticated = () => {
    if (params.sessionData) {
      return (
        <>
          <div
            className="absolute left-0 top-0 z-40 h-screen w-screen bg-black-transparent sm:bg-transparent"
            onClick={() => setToggleOptions(!toggleOptions)}
          />
          <Draggable
            axis="y"
            handle=".handle"
            onStop={handleStop}
            onDrag={handleDrag}
            defaultPosition={{
              x: 0,
              y: 0,
            }}
            cancel={".need-interaction"}
            bounds={{ top: 0, right: 0, left: 0 }}
            position={{ x: draggablePositionY, y: draggablePositionY }}
            nodeRef={drawerRef}
          >
            <div
              className="handle absolute bottom-0 left-0 right-0 z-50 flex w-screen cursor-grab flex-col gap-2 rounded-t-lg border-white1 bg-white px-8 pb-4 text-sm shadow-lg sm:bottom-auto sm:left-auto sm:right-5 sm:top-20 sm:w-auto sm:cursor-pointer sm:rounded-2xl sm:border-[1px] sm:p-8 sm:pt-2 sm:text-base"
              ref={drawerRef}
            >
              <div className="flex h-1 w-full flex-1 cursor-pointer justify-center pt-2 sm:hidden">
                <div className="h-[2px] w-10 bg-black" />
              </div>
              <Link
                href={params.username ? `/${params.username}` : "/"}
                className="group hidden items-center gap-4 py-2 sm:flex"
              >
                <FontAwesomeIcon icon={faUserCircle} className="fa-xl" />
                <div className="w-4/5 break-words group-hover:underline">
                  {params.username
                    ? params.username
                    : params.sessionData?.user.email}
                </div>
              </Link>

              <div className="hidden cursor-pointer border-[1px] border-white1 sm:flex" />

              <Link
                href="/explore/brands"
                className="need-interaction group flex cursor-pointer items-center gap-4 py-2 lg:hidden"
              >
                <FontAwesomeIcon icon={faSearch} className="fa-lg" />

                <div className="group-hover:underline">
                  {t("components.navbar.exploreBrands")}
                </div>
              </Link>

              <Link
                href="/saved/brands"
                className="need-interaction group flex cursor-pointer items-center gap-4 py-2 lg:hidden"
              >
                <FontAwesomeIcon icon={faBookmark} className="fa-lg pl-1" />

                <div className="group-hover:underline">
                  {t("components.navbar.savedBrands")}
                </div>
              </Link>
              <div className="cursor-pointer border-[1px] border-white1 lg:hidden" />

              <Link
                href="/manage-offers"
                className="need-interaction group flex cursor-pointer items-center gap-4 py-2"
              >
                <FontAwesomeIcon icon={faBriefcase} className="fa-lg" />

                <div className="group-hover:underline">
                  {t("components.navbar.myOffers")}
                </div>
              </Link>

              {params.role && params.role.id !== 1 && (
                <Link
                  href="/my-applications"
                  className="need-interaction group flex cursor-pointer items-center gap-4 py-2"
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="fa-lg" />

                  <div className="group-hover:underline">
                    {t("components.navbar.applications")}
                  </div>
                </Link>
              )}

              <div className="cursor-pointer border-[1px] border-white1" />

              <div
                className="group flex cursor-pointer items-center gap-4 py-2"
                onClick={() => void signOut()}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="fa-lg"
                />
                <span
                  className="need-interaction group-hover:underline"
                  onClick={() => void signOut()}
                >
                  {t("components.navbar.signOut")}
                </span>
              </div>

              <div className="flex cursor-pointer border-[1px] border-white1" />

              <Link
                href="/settings"
                className="need-interaction group flex cursor-pointer items-center gap-4 py-2"
              >
                <FontAwesomeIcon icon={faGear} className="fa-lg" />

                <div className="group-hover:underline">
                  {t("components.navbar.settings")}
                </div>
              </Link>
              <div
                className="need-interaction group flex cursor-pointer items-center gap-4 py-2 sm:hidden"
                onClick={() => setOPenHelpCenter(true)}
              >
                <FontAwesomeIcon icon={faLifeRing} className="fa-lg" />

                <div className="group-hover:underline">
                  {t("components.navbar.helpCenter")}
                </div>
              </div>
            </div>
          </Draggable>
        </>
      );
    }
  };

  const navigationHelpers = () => {
    return (
      <div className="absolute right-0 top-0 z-50 flex h-full w-full flex-col gap-2 bg-white p-4 lg:hidden">
        <div
          className="flex cursor-pointer items-center gap-4"
          onClick={() => setOPenHelpCenter(false)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />

          <div className="font-semibold">
            {t("components.navbar.helpCenter")}
          </div>
        </div>
        <Link
          href="/about"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faAddressCard} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.aboutUs")}
          </div>
        </Link>
        <Link
          href="/contact-us"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faEnvelope} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.contactUs")}
          </div>
        </Link>
        <Link
          href="/faq"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faCircleQuestion} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.faq")}
          </div>
        </Link>
        <div className="cursor-pointer border-[1px] border-white1" />

        <Link
          href="/terms-conditions"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faFileLines} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.terms")}
          </div>
        </Link>
        <Link
          href="/privacy-policy"
          className="group flex cursor-pointer items-center gap-4 py-2"
        >
          <FontAwesomeIcon icon={faFileLines} className="fa-lg" />

          <div className="group-hover:underline">
            {t("components.navbar.privacy")}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <nav>
      <div className="flex w-full select-none items-center justify-between px-4 py-2 lg:h-16 lg:gap-4 lg:p-12">
        {renderLogoTitle()}
        {leftNavBar()}
        {rightNavbar()}
      </div>
    </nav>
  );
};
