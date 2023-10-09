import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

const ToolTip = (params: { content: string; color?: "warning" | "valid" }) => {
  const [showTip, setShowtip] = useState<boolean>(false);

  let color = "text-gray2";

  if (params.color === "warning") {
    color = "text-red-500";
  } else if (params.color === "valid") {
    color = "text-influencer-green";
  }

  const iconClasses = `fa-lg cursor-pointer ${color}`;

  const dropdown = () => {
    return (
      <div
        className="absolute top-3 z-10 w-auto rounded-lg border-[1px] bg-gray4 px-4 py-2 text-white opacity-90 xs:left-[-35px] xs:w-72 lg:w-80 text-sm"
        onClick={() => setShowtip(!showTip)}
      >
        {params.content}
      </div>
    );
  };

  return (
    <>
      <div
        className="group relative flex items-center"
        onClick={() => setShowtip(!showTip)}
      >
        <FontAwesomeIcon icon={faCircleQuestion} className={iconClasses} />
        <div className="hidden group-hover:flex">{dropdown()}</div>
        {showTip && <div className="flex sm:hidden">{dropdown()}</div>}
      </div>
    </>
  );
};

export { ToolTip };
