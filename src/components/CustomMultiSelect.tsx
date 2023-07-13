import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { useOutsideClick } from "../utils/helper";

export type Option = {
  id: number;
  name: string;
};

export const CustomMultiSelect = (params: {
  name: string;
  placeholder: string;
  options: Option[] | undefined;
  selectedOptions: Option[];
  handleOptionSelect: (options: Option[]) => void;
  hideArrow?: boolean;
  hideBorder?: boolean;
}) => {
  const [selectStatus, setSelectStatus] = useState<boolean>(false);

  const multiSelectRef = useRef(null);

  const onHandleClick = (option: Option) => {
    const newArray: Option[] = [...params.selectedOptions];
    const index = getIndexFromArrayOfObjects(newArray, option);

    if (index > -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(option);
    }

    params.handleOptionSelect(newArray);
  };

  const getIndexFromArrayOfObjects = (arr: Option[], option: Option) => {
    const stringArray = arr.map((item) => {
      return item.id;
    });

    return stringArray.indexOf(option.id);
  };

  useOutsideClick(() => {
    if (selectStatus === false) return;

    setSelectStatus(!selectStatus);
  }, multiSelectRef);

  const renderArrows = () => {
    if (selectStatus) {
      return (
        <FontAwesomeIcon
          icon={faChevronUp}
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faChevronDown}
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
        />
      );
    }
  };

  const renderInput = () => {
    const selectedOptionsCopy = [...params.selectedOptions];
    const newValues = selectedOptionsCopy
      .map((option) => {
        return option.name;
      })
      .join(",  ");

    let inputclasses =
      "flex h-14 w-full flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12";

    if (params.hideBorder) {
      inputclasses =
        "flex h-14 w-full flex-1 cursor-pointer rounded-lg bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12";
    }

    return (
      <div ref={multiSelectRef} className="h-14 w-full">
        <div className="relative flex items-center justify-between">
          <input
            required
            id={`${params.name}1`}
            onKeyDown={(e) => {
              e.preventDefault();
              return false;
            }}
            inputMode="none"
            className={inputclasses}
            placeholder={params.placeholder}
            value={newValues}
            autoComplete="off"
            onClick={() => {
              setSelectStatus(!selectStatus);
            }}
            onChange={() => {
              return;
            }}
          />
          {!params.hideArrow && renderArrows()}
        </div>
        {renderOptions()}
      </div>
    );
  };

  const renderOptions = () => {
    if (selectStatus) {
      return (
        <div className="relative z-10 h-56 overflow-hidden rounded-lg border-[1px] border-gray3  bg-white sm:h-auto">
          <div className="flex h-56 flex-col overflow-y-auto sm:h-auto sm:flex-row sm:flex-wrap sm:justify-start sm:p-2 ">
            {params.options &&
              params.options.map((option) => {
                let optionClass = "";

                if (
                  getIndexFromArrayOfObjects(params.selectedOptions, option) >
                  -1
                ) {
                  optionClass =
                    "flex cursor-pointer items-center p-4 bg-influencer-green text-white hover:bg-influencer-green hover:text-white sm:m-2 sm:h-7 sm:w-auto sm:justify-center sm:rounded-full sm:border-[1px]";
                } else {
                  optionClass =
                    "flex cursor-pointer items-center p-4 sm:hover:bg-influencer-green sm:hover:text-white sm:m-2 sm:h-7 sm:w-auto sm:justify-center sm:rounded-full sm:border-[1px]";
                }

                return (
                  <div
                    className={optionClass}
                    key={option.id}
                    onClick={() => onHandleClick(option)}
                  >
                    {option.name}
                  </div>
                );
              })}
          </div>
        </div>
      );
    }
  };

  return renderInput();
};
