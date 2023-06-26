import { signIn, signOut } from "next-auth/react";
import { type Session } from "next-auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faBell,
  faCircleUser,
} from "@fortawesome/free-regular-svg-icons";

import { Button } from "../Button/Button";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";

export const Navbar = (params: {
  sessionData: Session | null;
  openLoginModal: () => void;
}) => {
  const [toggleHamburguer, setToggleHamburguer] = useState<boolean>(false);

  const leftNavBar = () => {
    return (
      <div className="flex flex-1 justify-start">
        <Link href="/" className="cursor-pointer text-lg lg:p-2">
          Home
        </Link>
        <Link href="/explore" className="cursor-pointer text-lg lg:p-2">
          Explore
          {params.sessionData && (
            <FontAwesomeIcon
              icon={faChevronDown}
              className="fa-sm cursor-pointer px-5"
            />
          )}
        </Link>
        {params.sessionData && (
          <span className="cursor-pointer text-lg lg:p-2">
            Saved
            <FontAwesomeIcon
              icon={faChevronDown}
              className="fa-sm cursor-pointer px-5"
            />
          </span>
        )}
      </div>
    );
  };

  const rightNavBeforeLogin = () => {
    return (
      <div className="flex flex-row items-center justify-end">
        <span
          className="cursor-pointer text-lg lg:p-2"
          onClick={() => params.openLoginModal()}
        >
          Sign in
        </span>
        <Button title="Join Marketplace" level="primary" />
      </div>
    );
  };

  const rightNavbarAfterLogin = () => {
    return (
      <div className="flex flex-row items-center justify-end">
        {params.sessionData && (
          <span
            className="cursor-pointer text-black"
            onClick={() => void signOut()}
          >
            Sign out
          </span>
        )}
        <FontAwesomeIcon
          icon={faMessage}
          className="fa-xl cursor-pointer px-5"
        />
        <FontAwesomeIcon icon={faBell} className="fa-xl cursor-pointer px-5" />
        <div>
          <FontAwesomeIcon
            icon={faCircleUser}
            className="fa-2xl cursor-pointer px-5"
          />
        </div>
      </div>
    );
  };

  const renderLogoTitle = () => {
    return (
      <Link href="/">
        <h1 className="m-0 cursor-pointer text-left font-lobster text-2xl text-influencer lg:m-8 lg:text-4xl">
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
        {toggleHamburguer && dropDownMenu()}
      </div>
    );
  };

  const dropDownMenu = () => {
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
          <div className="flex cursor-pointer items-center gap-6">
            <FontAwesomeIcon icon={faCircleUser} className="fa-2xl" />
            <Button title="Get Started" level="primary" />
          </div>
          <div className="border-[1px] border-white1" />
          <span className="cursor-pointer text-lg ">Home</span>
          <span className="cursor-pointer text-lg ">Explore</span>
          <div className="border-[1px] border-white1" />
          <span className="cursor-pointer text-lg ">Sign in</span>
        </div>
      </>
    );
  };

  const renderDesktopMenu = () => {
    return (
      <div className="hidden h-16 w-full items-center px-6 py-12 lg:flex">
        {renderLogoTitle()}
        {leftNavBar()}
        {!params.sessionData && rightNavBeforeLogin()}
        {params.sessionData && rightNavbarAfterLogin()}
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
