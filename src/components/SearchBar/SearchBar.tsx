import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const SearchBar = () => {
  return (
    <div className="m-10 flex h-16 w-8/12 items-center rounded-2xl px-4 shadow-lg">
      <input
        placeholder="categories"
        className="flex h-4/5 flex-1 bg-transparent text-black"
      />
      <div className="flex h-12 w-14 cursor-pointer items-center justify-center rounded-2xl bg-influencer">
        <FontAwesomeIcon
          icon={faSearch}
          className="fa-xl cursor-pointer px-5 text-white"
        />
      </div>
    </div>
  );
};
