import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Question } from "./innerComponents/Questions";
import Link from "next/link";
import { Button } from "../../components/Button";
import { type QuestionType } from "../../utils/globalTypes";

const FAQPage = () => {
  const [showInfluencerQuestions, setShowInfluencerQuestions] =
    useState<boolean>(true);
  const [showBrandQuestions, setShowBrandQuestions] = useState<boolean>(false);
  const { t } = useTranslation();

  const questionsInfluencers: QuestionType[] = [
    {
      question: t("pages.faq.questions.influencers.question1"),
      answer: t("pages.faq.answer.influencers.answer1"),
    },
    {
      question: t("pages.faq.questions.influencers.question2"),
      answer: t("pages.faq.answer.influencers.answer2"),
    },
    {
      question: t("pages.faq.questions.influencers.question3"),
      answer: t("pages.faq.answer.influencers.answer3", { fee: 10 }),
    },
    {
      question: t("pages.faq.questions.influencers.question4"),
      answer: t("pages.faq.answer.influencers.answer4"),
    },
    {
      question: t("pages.faq.questions.influencers.question5"),
      answer: t("pages.faq.answer.influencers.answer5"),
    },
    {
      question: t("pages.faq.questions.influencers.question6"),
      answer: t("pages.faq.answer.influencers.answer6"),
    },
    {
      question: t("pages.faq.questions.influencers.question7"),
      answer: t("pages.faq.answer.influencers.answer7"),
    },
    {
      question: t("pages.faq.questions.influencers.question8"),
      answer: t("pages.faq.answer.influencers.answer8"),
    },
    {
      question: t("pages.faq.questions.influencers.question9"),
      answer: t("pages.faq.answer.influencers.answer9"),
    },
  ];

  const questionsBrands: QuestionType[] = [
    {
      question: t("pages.faq.questions.brands.question1"),
      answer: t("pages.faq.answer.brands.answer1"),
    },
    {
      question: t("pages.faq.questions.brands.question2"),
      answer: t("pages.faq.answer.brands.answer2"),
    },
    {
      question: t("pages.faq.questions.brands.question3"),
      answer: t("pages.faq.answer.brands.answer3"),
    },
    {
      question: t("pages.faq.questions.brands.question4"),
      answer: t("pages.faq.answer.brands.answer4"),
    },
    {
      question: t("pages.faq.questions.brands.question5"),
      answer: t("pages.faq.answer.brands.answer5"),
    },
    {
      question: t("pages.faq.questions.brands.question6"),
      answer: t("pages.faq.answer.brands.answer6"),
    },
    {
      question: t("pages.faq.questions.brands.question7"),
      answer: t("pages.faq.answer.brands.answer7"),
    },
    {
      question: t("pages.faq.questions.brands.question8"),
      answer: t("pages.faq.answer.brands.answer8"),
    },
  ];

  const renderInfluencersQuestion = () => {
    if (showInfluencerQuestions) {
      return (
        <div className="flex flex-1 flex-col gap-6">
          {questionsInfluencers.map((question, index) => {
            return (
              <div key={question.question} className="flex flex-col gap-12">
                <Question
                  question={question.question}
                  answer={question.answer}
                />
                {questionsInfluencers.length - 1 !== index && (
                  <div className="w-full border-[1px] border-white1" />
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderBrandQuestions = () => {
    if (showBrandQuestions) {
      return (
        <div className="flex flex-1 flex-col gap-6">
          {questionsBrands.map((question, index) => {
            return (
              <div key={question.question} className="flex flex-col gap-12">
                <Question
                  question={question.question}
                  answer={question.answer}
                />
                {questionsBrands.length - 1 !== index && (
                  <div className="w-full border-[1px] border-white1" />
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderQuestionsHeader = () => {
    return (
      <div className="flex justify-center gap-6 text-center lg:gap-12">
        <div
          className="flex flex-col gap-2"
          onClick={() => {
            setShowBrandQuestions(false);
            setShowInfluencerQuestions(true);
          }}
        >
          <div
            className={
              showInfluencerQuestions
                ? "cursor-pointer text-xl font-medium lg:text-2xl"
                : "cursor-pointer text-xl font-medium text-gray4 lg:text-2xl"
            }
          >
            {t("pages.faq.questions.influencers.title")}
          </div>
          {showInfluencerQuestions && (
            <div className="h-2 w-full rounded-2xl bg-influencer" />
          )}
        </div>

        <div
          className="flex flex-col gap-2"
          onClick={() => {
            setShowInfluencerQuestions(false);
            setShowBrandQuestions(true);
          }}
        >
          <div
            className={
              showBrandQuestions
                ? "cursor-pointer text-xl font-medium lg:text-2xl"
                : "cursor-pointer text-xl font-medium text-gray4 lg:text-2xl"
            }
          >
            {t("pages.faq.questions.brands.title")}
          </div>
          {showBrandQuestions && (
            <div className="h-2 w-full rounded-2xl bg-influencer" />
          )}
        </div>
      </div>
    );
  };

  const renderGoToContacts = () => {
    return (
      <div className="flex flex-col items-center gap-4 rounded-t-2xl bg-influencer-green px-12 pb-4 pt-12 text-center">
        <div className="text-xl font-semibold">
          {t("pages.faq.doubt.title")}
        </div>
        <div className="text-lg font-semibold text-white">
          {t("pages.faq.doubt.subTitle")}
        </div>
        <Link href="/contact-us">
          <Button title={t("pages.faq.doubt.button")} level="primary" />
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-16 px-4 pt-4 lg:gap-24 xl:w-3/4 xl:self-center 2xl:w-3/4 3xl:w-3/4 4xl:w-2/4 5xl:w-2/4">
      <div className="flex flex-col justify-center text-center font-playfair text-5xl font-semibold">
        <h1 className="text-2xl lg:text-5xl">{t("pages.faq.title")}</h1>
        <h2 className="p-2 text-xl  font-normal text-gray1 lg:p-7 lg:text-3xl">
          {t("pages.faq.subTitle")}
        </h2>
      </div>
      <div className="flex flex-col gap-16">
        {renderQuestionsHeader()}
        {renderBrandQuestions()}
        {renderInfluencersQuestion()}
      </div>
      {renderGoToContacts()}
    </div>
  );
};

export { FAQPage };
