import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { type UseFormRegister } from "react-hook-form";

import { type Option } from "./CustomMultiSelect";
import { useOutsideClick } from "../utils/helper";

export const CustomSelect = (params: {
  register?: UseFormRegister<any>;
  noBorder?: boolean;
  name: string;
  placeholder: string;
  value: Option;
  options: Option[] | undefined;
  handleOptionSelect: (option: Option) => void;
}) => {
  const [selectStatus, setSelectStatus] = useState<boolean>(false);
  const customSelectWrapperRef = useRef(null);
  let customBorder =
    "flex h-14 w-full flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-10/12";

  useOutsideClick(() => {
    if (selectStatus === false) return;

    setSelectStatus(!selectStatus);
  }, customSelectWrapperRef);

  if (params.noBorder) {
    customBorder =
      "flex h-14 w-full flex-1 cursor-pointer bg-transparent p-4 placeholder-gray2 caret-transparent placeholder:w-11/12";
  }

  return (
    <div
      className="h-14 w-full"
      onClick={() => {
        setSelectStatus(!selectStatus);
      }}
    >
      <div className="relative flex items-center justify-between">
        {params.register ? (
          <input
            {...params.register(params.name)}
            required
            ref={customSelectWrapperRef}
            id={`${params.name}1`}
            onKeyDown={(e) => {
              e.preventDefault();
              return false;
            }}
            className={customBorder}
            placeholder={params.placeholder}
            defaultValue={params.value.name}
            autoComplete="off"
            readOnly
          />
        ) : (
          <input
            required
            ref={customSelectWrapperRef}
            id={`${params.name}2`}
            onKeyDown={(e) => {
              e.preventDefault();
              return false;
            }}
            className={customBorder}
            placeholder={params.placeholder}
            defaultValue={params.value.name}
            autoComplete="off"
            readOnly
          />
        )}
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

      {selectStatus && (
        <div className="relative z-10 h-auto overflow-y-auto rounded-lg border-[1px] border-gray3 bg-white">
          {params.options &&
            params.options.map((option) => {
              let classes = "";
              if (params.value.id === option.id) {
                classes =
                  "cursor-pointer bg-influencer-green p-4 text-white hover:bg-influencer-green hover:text-white";
              } else {
                classes =
                  "cursor-pointer p-4 hover:bg-influencer-green hover:text-white";
              }
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    params.handleOptionSelect(option);
                  }}
                  className={classes}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-3/4`}>{option.name}</div>
                    <div>
                      {params.value.id === option.id ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="fa-xl"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faCircle} className="fa-xl" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
