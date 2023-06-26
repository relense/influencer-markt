import { type ReactElement } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Modal = ({
  children,
  onClose,
}: {
  children: ReactElement;
  onClose: () => void;
}) => {
  return (
    <>
      <div
        className="absolute left-0 top-0 h-full w-full bg-gray1 opacity-30"
        onClick={() => onClose()}
      />

      <div className="absolute top-10 z-40 w-11/12 rounded-lg bg-white p-4 sm:h-auto md:top-20 md:w-2/4 lg:w-2/4 2xl:w-1/4">
        <div
          className="absolute right-[-10px] top-[-10px] flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-full bg-influencer-green sm:right-[-10px] sm:h-12 sm:w-12"
          onClick={() => onClose()}
        >
          <FontAwesomeIcon icon={faXmark} className="fa-lg text-white" />
        </div>
        <div className="z-50 h-[400px] overflow-y-auto xs:h-full">
          {children}
        </div>
      </div>
    </>
  );
};

export { Modal };
