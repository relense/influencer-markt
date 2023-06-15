import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import { useRef, useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useOutsideClick } from "../../utils/helper";

type Option = {
  id: string;
  option: string;
};

export const CustomSelect = (params: {
  placeholder: string;
  options: Option[];
  handleOptionSelect: (option: string) => void;
}) => {
  const [selectStatus, setSelectStatus] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>({
    id: "",
    option: "",
  });
  const wrapperRef = useRef(null);

  const onHandleClick = (selectedOption: Option) => {
    setSelectedOption(selectedOption);
    params.handleOptionSelect(selectedOption.id);
  };

  useOutsideClick(() => {
    if (selectStatus === false) return;

    setSelectStatus(!selectStatus);
  }, wrapperRef);

  return (
    <div
      ref={wrapperRef}
      className="h-14 rounded-lg border-[1px] border-gray3"
      onClick={() => {
        setSelectStatus(!selectStatus);
      }}
    >
      <div className="flex items-center justify-between p-4">
        <div
          className={`overflow-hidden whitespace-nowrap ${
            selectedOption.id === "" ? "text-gray2" : "text-inherit"
          }`}
        >
          {selectedOption.id === ""
            ? params.placeholder
            : selectedOption.option}
        </div>

        <FontAwesomeIcon icon={faChevronDown} className="fa-base" />
      </div>

      {selectStatus && (
        <div className="relative h-auto overflow-hidden rounded-lg border-[1px] border-gray3 bg-white">
          {params.options.map((option) => {
            let classes = "";
            if (selectedOption.id === option.id) {
              classes =
                "cursor-pointer bg-influencer-green p-4 text-white hover:bg-influencer-green hover:text-white";
            } else {
              classes =
                "cursor-pointer p-4 hover:bg-influencer-green hover:text-white";
            }
            return (
              <div
                key={option.id}
                onClick={() => onHandleClick(option)}
                className={classes}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-3/4`}>{option.option}</div>
                  <div>
                    {selectedOption.id === option.id ? (
                      <FontAwesomeIcon icon={faCircleCheck} className="fa-xl" />
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
