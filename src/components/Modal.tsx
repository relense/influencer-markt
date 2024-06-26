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
        className="fixed left-0 top-0 h-full w-full bg-gray1 opacity-30"
        onClick={() => (onCloseBackground ? onCloseBackground() : onClose())}
      />

      <div className="fixed top-10 z-50 w-11/12 rounded-lg bg-white sm:h-auto md:top-10 md:w-3/4 lg:w-6/12 2xl:w-5/12 3xl:w-5/12 4xl:w-4/12 5xl:w-4/12">
        <div
          className="absolute right-[-5px] top-[-18px] flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-full bg-influencer-green xs:right-[-15px] xs:top-[-25px] sm:right-[-10px] sm:h-12 sm:w-12"
          onClick={() => onClose()}
        >
          <FontAwesomeIcon icon={faXmark} className="fa-xl text-white" />
        </div>
        <div className="z-50 flex max-h-[55vh] flex-col overflow-y-auto xxs:max-h-[62vh] xl:max-h-[75vh] 3xl:max-h-[75vh]">
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
