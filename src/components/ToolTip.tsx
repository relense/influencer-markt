import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

const ToolTip = (params: { content: string; color?: "warning" | "valid" }) => {
  let color = "text-gray2";

  if (params.color === "warning") {
    color = "text-red-500";
  } else if (params.color === "valid") {
    color = "text-influencer-green";
  }

  const iconClasses = `fa-lg cursor-pointer ${color}`;

  return (
    <>
      <div className="group relative flex items-center">
        <FontAwesomeIcon icon={faCircleQuestion} className={iconClasses} />
        <div className="absolute top-3 z-10 hidden w-auto rounded-lg border-[1px] bg-gray4 px-4 py-4 text-white opacity-90 group-hover:flex xs:left-[-35px] xs:w-72 lg:w-96">
          {params.content}
        </div>
      </div>
    </>
  );
};

export { ToolTip };
