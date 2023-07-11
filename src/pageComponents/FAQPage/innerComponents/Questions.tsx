import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

export type QuestionType = {
  question: string;
  answer: string;
};

const Question = (params: QuestionType) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  return (
    <div
      className="flex w-full cursor-default flex-col gap-4"
      onClick={() => setShowAnswer(!showAnswer)}
    >
      <div className="flex flex-1">
        <div className="text-base font-semibold lg:text-lg">
          {params.question}
        </div>
        <div className="pointer-events-none flex flex-1 cursor-pointer justify-end lg:pointer-events-auto">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1px] border-gray3">
            <FontAwesomeIcon
              icon={showAnswer ? faMinus : faPlus}
              className="fa-sm cursor-pointer text-gray3"
            />
          </div>
        </div>
      </div>
      {showAnswer && (
        <div className="w-11/12 text-base text-gray2 lg:text-lg">
          {params.answer}
        </div>
      )}
    </div>
  );
};

export { Question };
