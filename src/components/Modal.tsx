import { useEffect, type ReactElement } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Modal = ({
  children,
  onClose,
  onCloseBackground,
  title,
  button,
}: {
  children: ReactElement;
  onClose: () => void;
  onCloseBackground?: () => void;
  title?: string;
  button?: ReactElement;
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseBackground ? onCloseBackground() : onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, onCloseBackground]);

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
        <div className="z-50 flex max-h-[300px] flex-col overflow-y-auto xxs:max-h-[450px] xs:max-h-[600px] 2xl:max-h-[800px] 3xl:max-h-[1000px]">
          {title && (
            <div className="flex flex-1 flex-col items-center">
              <div className="py-2 text-center">{title}</div>
              <div className="w-full border-[1px] border-white1" />
            </div>
          )}
          {children}
        </div>

        {button && button}
      </div>
    </>
  );
};

export { Modal };
