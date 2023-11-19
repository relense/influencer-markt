import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const ToolTipWithoutIcon = (params: {
  content: string;
  onClose: () => void;
}) => {
  return (
    <>
      <div
        className="fixed left-0 top-0 h-full w-full"
        onClick={() => params.onClose()}
      />
      <div className="group relative flex items-center">
        <div className="group-hover:flex">
          <div className="absolute top-[-60px] z-10 w-auto rounded-lg border-[1px] bg-gray4 px-4 py-2 text-sm text-white opacity-90 xs:left-0 xs:w-72 lg:w-80">
            <div className="flex gap-6">
              <div>
                <FontAwesomeIcon icon={faX} />
              </div>
              <div>{params.content}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ToolTipWithoutIcon };
