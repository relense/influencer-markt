import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faBell,
  faCircleUser,
} from "@fortawesome/free-regular-svg-icons";

import { Button } from "../Button/Button";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const Navbar = () => {
  const [toggleHamburguer, setToggleHamburguer] = useState<boolean>(false);
  const user = useUser();

  const leftNavBeforeLogin = () => {
    return (
      <div className="flex flex-1 justify-start">
        <span className="cursor-pointer text-lg lg:p-2">Home</span>
        <span className="cursor-pointer text-lg lg:p-2">Explore</span>
      </div>
    );
  };

  const leftNavAfterLogin = () => {
    return (
      <div className="flex flex-1 justify-start">
        <span className="cursor-pointer text-lg lg:p-2">Home</span>
        <span className="cursor-pointer text-lg lg:p-2">
          Explore
          <FontAwesomeIcon
            icon={faChevronDown}
            className="fa-sm cursor-pointer px-5"
          />
        </span>
        <span className="cursor-pointer text-lg lg:p-2">
          Saved
          <FontAwesomeIcon
            icon={faChevronDown}
            className="fa-sm cursor-pointer px-5"
          />
        </span>
      </div>
    );
  };

  const rightNavBeforeLogin = () => {
    return (
      <div className="flex flex-row items-center justify-end">
        <SignInButton mode="modal">
          <span className="cursor-pointer text-lg lg:p-2">Sign in</span>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button title="Join Marketplace" level="primary" />
        </SignUpButton>
      </div>
    );
  };

  const rightNavbarAfterLogin = () => {
    return (
      <div className="flex flex-row items-center justify-end">
        {!!user.isSignedIn && (
          <SignOutButton>
            <span className="cursor-pointer text-black">Sign out</span>
          </SignOutButton>
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
      <h1 className="m-0 cursor-pointer text-left font-lobster text-2xl text-influencer lg:m-8 lg:text-4xl">
        Influencer Markt
      </h1>
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
          className="absolute right-5 top-10 z-10 flex h-auto w-72 flex-col gap-4 rounded-2xl border-[1px] border-white1 bg-white p-8 shadow-lg"
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
          <SignInButton mode="modal">
            <span className="cursor-pointer text-lg ">Sign in</span>
          </SignInButton>
        </div>
      </>
    );
  };

  const renderDesktopMenu = () => {
    return (
      <div className="hidden h-16 w-full items-center px-6 py-12 lg:flex">
        {renderLogoTitle()}
        {!user.isSignedIn && leftNavBeforeLogin()}
        {!user.isSignedIn && rightNavBeforeLogin()}
        {user.isSignedIn && leftNavAfterLogin()}
        {user.isSignedIn && rightNavbarAfterLogin()}
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
