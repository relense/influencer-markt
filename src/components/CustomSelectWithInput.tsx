import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { type UseFormRegister } from "react-hook-form";

import { useOutsideClick } from "../utils/helper";

export const CustomSelectWithInput = (params: {
  register?: UseFormRegister<any>;
  noBorder?: boolean;
  name: string;
  placeholder: string;
  value: string;
  options: string[] | undefined;
  handleOptionSelect: (value: string) => void;
  required?: boolean;
  emptyOptionsMessage: string;
  isReadOnly?: boolean;
}) => {
  const [selectStatus, setSelectStatus] = useState<boolean>(false);
  const customSelectWrapperRef = useRef(null);
  let customBorder = `flex h-14 w-full flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-10/12 focus:border-black focus:outline-none`;

  useOutsideClick(() => {
    if (selectStatus === false) return;

    setSelectStatus(!selectStatus);
  }, customSelectWrapperRef);

  if (params.noBorder) {
    customBorder = `flex h-14 w-full flex-1 cursor-pointer bg-transparent p-4 placeholder-gray2 placeholder:w-11/12`;
  }

  const renderDropdown = () => {
    if (customSelectWrapperRef.current) {
      if (params.value) {
        return (
          <div className="relative z-10 h-auto max-h-52 overflow-y-auto rounded-2xl border-[1px] border-gray3 bg-white shadow-xl">
            {params.options &&
              params.options.map((option, index) => {
                let classes = "";
                if (params.value === option) {
                  classes =
                    "cursor-pointer bg-influencer-green p-4 text-white hover:bg-influencer-green hover:text-white";
                } else {
                  classes =
                    "cursor-pointer p-4 hover:bg-influencer-green hover:text-white";
                }
                return (
                  <div
                    key={`${option} ${index}`}
                    onClick={() => {
                      params.handleOptionSelect(option);
                    }}
                    className={classes}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-3/4`}>{option}</div>
                      <div>
                        {params.value === option ? (
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
        );
      } else if (params.value === "") {
        return (
          <div className="relative z-10 h-auto max-h-52 overflow-y-auto rounded-2xl border-[1px] border-gray3 bg-white shadow-xl">
            <div className="pointer-events-none p-4">
              {params.emptyOptionsMessage}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div
      className="h-14 w-full"
      onClick={() => {
        setSelectStatus(!selectStatus);
      }}
    >
      <div className="relative flex items-center justify-between ">
        {params.register ? (
          <input
            {...params.register(params.name)}
            required={!params.required ? params.required : true}
            ref={customSelectWrapperRef}
            id={`${params.name}`}
            name={params.name}
            className={customBorder}
            placeholder={params.placeholder}
            value={params.value}
            autoComplete="one-time-code"
            onChange={(e) => {
              params.handleOptionSelect(e.target.value);
            }}
            readOnly={params.isReadOnly ? params.isReadOnly : false}
          />
        ) : (
          <input
            required={!params.required ? params.required : true}
            ref={customSelectWrapperRef}
            id={`${params.name}`}
            name={params.name}
            className={customBorder}
            placeholder={params.placeholder}
            value={params.value}
            autoComplete="one-time-code"
            onChange={(e) => {
              params.handleOptionSelect(e.target.value);
            }}
          />
        )}
        {selectStatus ? (
          <FontAwesomeIcon
            icon={faChevronUp}
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
          />
        ) : (
          <FontAwesomeIcon
            icon={faChevronDown}
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
          />
        )}
      </div>
      {selectStatus && renderDropdown()}
    </div>
  );
};
