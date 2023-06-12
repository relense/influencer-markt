import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faBell,
  faCircleUser,
} from "@fortawesome/free-regular-svg-icons";

import { Button } from "../Button/Button";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const user = useUser();

  const leftNavBeforeLogin = () => {
    return (
      <div className="flex flex-1 justify-start">
        <span className="cursor-pointer p-2 text-lg">Home</span>
        <span className="cursor-pointer p-2 text-lg">Explore</span>
      </div>
    );
  };

  const leftNavAfterLogin = () => {
    return (
      <div className="flex flex-1 justify-start">
        <span className="cursor-pointer p-2 text-lg">Home</span>
        <span className="cursor-pointer p-2 text-lg">
          Explore
          <FontAwesomeIcon
            icon={faChevronDown}
            className="fa-sm cursor-pointer px-5"
          />
        </span>
        <span className="cursor-pointer p-2 text-lg">
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
        {!user.isSignedIn && (
          <SignInButton>
            <span className="cursor-pointer p-2 text-lg">Sign in</span>
          </SignInButton>
        )}
        <Button title="Join Marketplace" />
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
      <h1 className="m-8 cursor-pointer font-lobster text-4xl text-influencer">
        Influencer Markt
      </h1>
    );
  };

  return (
    <div className="flex h-16 w-full items-center px-6 py-12">
      {renderLogoTitle()}
      {!user.isSignedIn && leftNavBeforeLogin()}
      {!user.isSignedIn && rightNavBeforeLogin()}
      {user.isSignedIn && leftNavAfterLogin()}
      {user.isSignedIn && rightNavbarAfterLogin()}
    </div>
  );
};
