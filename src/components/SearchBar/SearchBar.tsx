import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const SearchBar = () => {
  return (
    <div className="my-10 flex h-16 w-11/12 items-center rounded-2xl border-[1px] border-white1 px-4 shadow-lg sm:m-10 lg:w-8/12">
      <input
        placeholder="categories"
        className="flex h-4/5 flex-1 bg-transparent pl-1 text-black focus:outline-none sm:pl-4"
      />
      <div className="flex cursor-pointer items-center justify-center rounded-2xl sm:bg-influencer sm:p-4">
        <FontAwesomeIcon
          icon={faSearch}
          className="fa-xl text-influencer sm:text-white"
        />
      </div>
    </div>
  );
};
