import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const BottomBar = () => {
  return (
    <div className="flex w-full justify-between border-t-[1px] border-gray3 sm:hidden">
      <Link
        href="/"
        className="flex flex-1 cursor-pointer items-center justify-center  p-4 text-center"
      >
        <FontAwesomeIcon icon={faHome} className="fa-lg " />
      </Link>
      <Link
        href="/explore"
        className="flex flex-1 cursor-pointer items-center justify-center  p-4 text-center"
      >
        <FontAwesomeIcon icon={faSearch} className="fa-lg " />
      </Link>
      <Link
        href="/"
        className="flex flex-1 cursor-pointer items-center justify-center p-4 text-center"
      >
        <FontAwesomeIcon icon={faCircleUser} className="fa-xl" />
      </Link>
    </div>
  );
};

export { BottomBar };
