import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { type UseFormRegister } from "react-hook-form";

import { useOutsideClick } from "../../utils/helper";
import { type Option } from "../../utils/globalTypes";

export const CustomMultiSelect = (params: {
  register: UseFormRegister<any>;
  name: string;
  placeholder: string;
  options: Option[] | undefined;
  handleOptionSelect: (option: Option[]) => void;
}) => {
  const [selectStatus, setSelectStatus] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const multiSelectRef = useRef(null);

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
  }, multiSelectRef);

  const renderInput = () => {
    const values = selectedOptions
      .map((option) => {
        return option.option;
      })
      .join(",  ");

    return (
      <div ref={multiSelectRef} className="h-14 w-full">
        <div className="relative flex items-center justify-between">
          <input
            {...(params.register(params.name), { required: true })}
            id={`${params.name}1`}
            autoComplete="off"
            onKeyDown={(e) => {
              e.preventDefault();
              return false;
            }}
            className="flex h-14 w-full flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12"
            placeholder={params.placeholder}
            onClick={() => {
              setSelectStatus(!selectStatus);
            }}
            defaultValue={values}
          />
          {selectStatus ? (
            <FontAwesomeIcon
              icon={faChevronUp}
              className="pointer-events-none absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform"
            />
          ) : (
            <FontAwesomeIcon
              icon={faChevronDown}
              className="pointer-events-none absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform"
            />
          )}
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

  return renderInput();
};
