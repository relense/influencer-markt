import Image from "next/image";
import { Button } from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Question } from "../FAQPage/innerComponents/Questions";
import { type QuestionType } from "../../utils/globalTypes";
import { useTranslation } from "next-i18next";

const LandingHomePage = (params: { openLoginModal: () => void }) => {
  const { t } = useTranslation();

  const sectionOne = () => {
    return (
      <div className="flex w-full justify-center bg-influencer-green-disabled">
        <div className="flex w-full flex-col sm:flex-row lg:w-9/12 2xl:w-6/12">
          <div className="flex flex-1 flex-col justify-center gap-6 pl-12 pr-12 pt-12 md:p-6">
            <div className="text-3xl font-semibold leading-normal md:text-4xl md:leading-normal">
              {t("pages.landingHomePage.section1.title")}
            </div>
            <h3 className="text-xl leading-normal">
              {t("pages.landingHomePage.section1.subtitle")}
            </h3>
            <div>
              <Button
                title={t("pages.landingHomePage.section1.button")}
                size="large"
                level="primary"
                onClick={() => params.openLoginModal()}
              />
            </div>
          </div>

          <div className="flex flex-1">
            <Image
              src={`/images/landingPageElement1.png`}
              alt="Influencer Markt Landing Page Image 1"
              loading="lazy"
              width={2000}
              height={2000}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  const sectionTwo = () => {
    return (
      <div className="flex w-full justify-center bg-white">
        <div className="flex w-full flex-col-reverse sm:flex-row lg:w-9/12 2xl:w-6/12">
          <div className="flex flex-1">
            <Image
              src={`/images/landingPageElement2.png`}
              alt="Influencer Markt Landing Page Image 1"
              loading="lazy"
              width={2000}
              height={2000}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-6 pl-12 pr-12 pt-12 md:gap-12 md:p-6">
            <div className="text-3xl font-semibold leading-normal md:text-4xl">
              {t("pages.landingHomePage.section2.title")}
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section2.check1")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section2.check2")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section2.check3")}
              </h3>
            </div>
            <Link href="/explore/influencers">
              <Button
                title={t("pages.landingHomePage.section2.button")}
                size="large"
                level="primary"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const sectionThree = () => {
    return (
      <div className="flex w-full justify-center bg-influencer-green-disabled">
        <div className="flex w-full flex-col sm:flex-row lg:w-9/12 2xl:w-6/12">
          <div className="flex flex-1 flex-col justify-center gap-6 pl-12 pr-12 pt-12 md:gap-12 md:p-6">
            <div className="text-3xl font-semibold leading-normal md:text-4xl">
              {t("pages.landingHomePage.section3.title")}
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check1")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check2")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check3")}
              </h3>
            </div>
            <div>
              <Button
                title={t("pages.landingHomePage.section3.button")}
                size="large"
                level="primary"
                onClick={() => params.openLoginModal()}
              />
            </div>
          </div>
          <div className="flex flex-1">
            <Image
              src={`/images/landingPageElement3.png`}
              alt="Influencer Markt Landing Page Image 1"
              loading="lazy"
              width={2000}
              height={2000}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  const sectionFour = () => {
    return (
      <div className="flex w-full justify-center bg-white">
        <div className="flex w-full flex-col-reverse sm:flex-row lg:w-9/12 2xl:w-6/12">
          <div className="flex flex-1">
            <Image
              src={`/images/landingPageElement4.png`}
              alt="Influencer Markt Landing Page Image 1"
              loading="lazy"
              width={2000}
              height={2000}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-6 p-12 md:gap-12 md:p-6">
            <div className="text-3xl font-semibold leading-normal md:text-4xl">
              {t("pages.landingHomePage.section4.title")}
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check1")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check2")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check3")}
              </h3>
            </div>
            <div>
              <Button
                title={t("pages.landingHomePage.section4.button")}
                size="large"
                level="primary"
                onClick={() => params.openLoginModal()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sectionFive = () => {
    return (
      <div className="flex w-full justify-center bg-influencer-green-disabled">
        <div className="flex w-full flex-col sm:flex-row lg:w-9/12 2xl:w-6/12">
          <div className="flex flex-1 flex-col justify-center gap-6 pl-12 pr-12 pt-12 md:gap-12 md:p-6">
            <div className="text-3xl font-semibold leading-normal md:text-4xl">
              {t("pages.landingHomePage.section5.title")}
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check1")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check2")}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faCheck}
                className={`fa-2xl cursor-pointer text-influencer`}
              />
              <h3 className="text-lg leading-normal">
                {t("pages.landingHomePage.section3.check3")}
              </h3>
            </div>
            <div>
              <Button
                title={t("pages.landingHomePage.section5.button")}
                size="large"
                level="primary"
                onClick={() => params.openLoginModal()}
              />
            </div>
          </div>
          <div className="flex flex-1">
            <Image
              src={`/images/landingPageElement5.png`}
              alt="Influencer Markt Landing Page Image 1"
              loading="lazy"
              width={2000}
              height={2000}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  const sectionFaq = () => {
    const questions: QuestionType[] = [
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
    ];

    return (
      <div className="flex w-full justify-center p-12">
        <div className="flex w-full flex-col gap-12 lg:w-9/12 2xl:w-6/12">
          <div className="text-4xl font-semibold">{t("pages.faq.title")}</div>
          <div className="flex flex-1 flex-col gap-6">
            {questions.map((question, index) => {
              return (
                <div key={question.question} className="flex flex-col gap-12">
                  <Question
                    question={question.question}
                    answer={question.answer}
                  />
                  {questions.length - 1 !== index && (
                    <div className="w-full border-[1px] border-white1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {sectionOne()}
      {sectionTwo()}
      {sectionThree()}
      {sectionFour()}
      {sectionFive()}
      {sectionFaq()}
    </>
  );
};

export { LandingHomePage };
