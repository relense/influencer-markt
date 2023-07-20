import { type ReactElement } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Modal = ({
  children,
  onClose,
  onCloseBackground,
  title,
}: {
  children: ReactElement;
  onClose: () => void;
  onCloseBackground?: () => void;
  title?: string;
}) => {
  return (
    <>
      <div
        className="absolute left-0 top-0 h-full w-full bg-gray1 opacity-30"
        onClick={() => (onCloseBackground ? onCloseBackground() : onClose())}
      />

      <div className="absolute top-10 z-40 w-11/12 rounded-lg bg-white sm:h-auto md:top-10 md:w-2/4 lg:w-2/4 2xl:w-1/4">
        <div
          className="absolute right-[-15px] top-[-25px] flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-full bg-influencer-green sm:right-[-10px] sm:h-12 sm:w-12"
          onClick={() => onClose()}
        >
          <FontAwesomeIcon icon={faXmark} className="fa-lg text-white" />
        </div>
        <div className="2xl:max-h-auto z-50 flex max-h-[400px] flex-col overflow-y-auto xs:max-h-[600px] ">
          {title && (
            <div className="flex flex-1 flex-col items-center">
              <div className="py-2 text-center">{title}</div>
              <div className="w-full border-[1px] border-white1" />
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

export { Modal };
