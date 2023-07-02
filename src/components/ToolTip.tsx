import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

const ToolTip = (params: { content: string }) => {
  return (
    <>
      <div className="group relative flex items-center">
        <FontAwesomeIcon
          icon={faCircleQuestion}
          className="fa-lg cursor-pointer text-gray2"
        />
        <div className="absolute left-[-65px] top-3 z-10 hidden w-auto rounded-lg border-[1px] bg-gray4 px-4 py-4 text-white opacity-90 group-hover:flex xs:w-72 lg:w-96">
          {params.content}
        </div>
      </div>
    </>
  );
};

export { ToolTip };
