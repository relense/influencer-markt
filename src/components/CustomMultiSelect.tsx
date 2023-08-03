import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { useOutsideClick } from "../utils/helper";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import type { Option } from "../utils/globalTypes";

export const CustomMultiSelect = (params: {
  name: string;
  placeholder: string;
  options: Option[] | undefined;
  selectedOptions: Option[];
  handleOptionSelect: (options: Option[]) => void;
  hideArrow?: boolean;
  hideBorder?: boolean;
  borderType?: "mega-rounded" | "normal";
  hoverEffect?: boolean;
  clearSelection: () => void;
  required?: boolean;
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

  const renderClearButton = () => {
    return (
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="absolute right-10 top-1/2 h-6 w-6 -translate-y-1/2 transform cursor-pointer text-gray2"
        onClick={() => params.clearSelection()}
      />
    );
  };

  const renderInput = () => {
    const selectedOptionsCopy = [...params.selectedOptions];
    const newValues = selectedOptionsCopy
      .map((option) => {
        return option.name;
      })
      .join(",  ");

    let border = "border-[1px] border-gray3 rounded-lg";
    let rounded = "rounded-lg";
    let hoverEffect = "";

    if (params.hideBorder) {
      border = "";
    }
    if (params.borderType === "mega-rounded") {
      rounded = "rounded-2xl";
    }

    if (params.hoverEffect) {
      hoverEffect =
        "hover:rounded-2xl hover:border-[1px] hover:border-black hover:shadow-xl";
    }

    if (selectStatus) {
      border = "border-[1px] border-black rounded-2xl";
      hoverEffect = "hover:none";
    }

    const parentContainerClass = `flex h-auto w-full flex-col items-center justify-center gap-4 lg:h-14 lg:flex-row lg:gap-1 ${border}`;
    const inputContainerClasses = `relative flex items-center justify-between ${hoverEffect}`;
    const inputclasses = `flex h-14 w-10/12 cursor-pointer ${rounded} bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12 outline-none`;

    return (
      <div className={parentContainerClass}>
        <div ref={multiSelectRef} className="h-14 w-full">
          <div
            className={inputContainerClasses}
            onClick={() => {
              setSelectStatus(!selectStatus);
            }}
          >
            <input
              required={!params.required ? params.required : true}
              id={`${params.name}1`}
              onKeyDown={(e) => {
                e.preventDefault();
                return false;
              }}
              inputMode="none"
              className={inputclasses}
              placeholder={params.placeholder}
              value={newValues}
              autoComplete="one-time-code"
              onChange={() => {
                return;
              }}
            />
            {params.selectedOptions.length > 0 && renderClearButton()}
            {renderArrows()}
          </div>
          {renderOptions()}
        </div>
      </div>
    );
  };

  const renderOptions = () => {
    const dropdownClasses = `relative z-10 h-56 overflow-hidden border-[1px] border-gray3  bg-white sm:h-auto rounded-2xl shadow-xl max-h-56 overflow-y-auto`;

    if (selectStatus) {
      return (
        <div className={dropdownClasses}>
          <div className="flex h-56 flex-col overflow-y-auto shadow-2xl sm:h-auto sm:flex-row sm:flex-wrap sm:justify-start sm:p-2">
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
                  <div key={option.id}>
                    <div
                      className={optionClass + " hidden lg:flex"}
                      onClick={() => onHandleClick(option)}
                    >
                      {option.name}
                    </div>
                    <div
                      className={optionClass + " lg:hidden"}
                      onClick={() => {
                        setSelectStatus(false);
                        onHandleClick(option);
                      }}
                    >
                      {option.name}
                    </div>
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
