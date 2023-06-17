import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useOutsideClick } from "../../utils/helper";

export type Option = {
  id: number;
  option: string;
};

export const CustomMultiSelect = (params: {
  placeholder: string;
  options: Option[] | undefined;
  handleOptionSelect: (option: Option[]) => void;
}) => {
  const [selectStatus, setSelectStatus] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const wrapperRef = useRef(null);

  const onHandleClick = (option: Option) => {
    let newArray: Option[] = [...selectedOptions];
    const index = selectedOptions.indexOf(option);

    if (index > -1) {
      newArray = removeItemOnce(newArray, option);
      setSelectedOptions(newArray);
    } else {
      newArray.push(option);
      setSelectedOptions(newArray);
    }

    params.handleOptionSelect(newArray);
  };

  const removeItemOnce = (arr: Option[], value: Option) => {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }

    return arr;
  };

  useOutsideClick(() => {
    if (selectStatus === false) return;

    setSelectStatus(!selectStatus);
  }, wrapperRef);

  const renderInput = () => {
    return (
      <div
        className="flex h-14 items-center justify-between p-4"
        onClick={() => {
          setSelectStatus(!selectStatus);
        }}
      >
        {selectedOptions.length ? (
          <div className="flex gap-2 overflow-x-hidden sm:overflow-x-auto">
            {selectedOptions.map((option) => {
              return (
                <div
                  key={option.id}
                  className="flex w-32 cursor-pointer items-center justify-center rounded-full border-[1px] p-4 sm:h-7 sm:w-36 sm:justify-between"
                >
                  {option.option}
                  <div className="hidden sm:flex">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="fa-sm"
                      onClick={() => onHandleClick(option)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden whitespace-nowrap text-gray2">
            {params.placeholder}
          </div>
        )}

        <FontAwesomeIcon icon={faChevronDown} className="fa-base" />
      </div>
    );
  };

  const renderOptions = () => {
    if (selectStatus) {
      return (
        <div className="relative h-56 overflow-hidden rounded-lg border-[1px] border-gray3 bg-white  sm:h-auto ">
          <div className="flex h-56 flex-col overflow-y-scroll sm:h-auto sm:flex-row sm:flex-wrap sm:justify-start sm:p-2 ">
            {params.options &&
              params.options.map((option) => {
                let optionClass = "";

                if (selectedOptions.indexOf(option) > -1) {
                  optionClass =
                    "flex cursor-pointer items-center p-4 bg-influencer-green text-white hover:bg-influencer-green hover:text-white sm:m-2 sm:h-7 sm:w-28 sm:justify-center sm:rounded-full sm:border-[1px]";
                } else {
                  optionClass =
                    "flex cursor-pointer items-center p-4 sm:hover:bg-influencer-green sm:hover:text-white sm:m-2 sm:h-7 sm:w-28 sm:justify-center sm:rounded-full sm:border-[1px]";
                }

                return (
                  <div
                    className={optionClass}
                    key={option.id}
                    onClick={() => onHandleClick(option)}
                  >
                    {option.option}
                  </div>
                );
              })}
          </div>
        </div>
      );
    }
  };

  return (
    <div ref={wrapperRef}>
      <div className="h-14rounded-lg rounded-lg border-[1px] border-gray3 ">
        {renderInput()}
      </div>
      {renderOptions()}
    </div>
  );
};
