import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  type IconDefinition,
  faMessage,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faHandHoldingDollar,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { SimpleSearchBar } from "./innerComponents/SimpleSearchBar";
import { Button } from "../../components/Button";

type Offer = {
  icon: IconDefinition;
  titleOne: string;
  subTitleOne: string;
  titleTwo: string;
  subTitleTwo: string;
};

const brands = [
  "instagram",
  "x",
  "facebook",
  "linkedin",
  "pinterest",
  "youtube",
  "twitch",
];

const HomePage = (params: {
  openLoginModal: () => void;
  profileId: string;
}) => {
  const { t } = useTranslation("home");
  const session = useSession();

  const offers: Offer[] = [
    {
      icon: faHandHoldingDollar,
      titleOne: t("home.offers.offer1.title1"),
      subTitleOne: t("home.offers.offer1.subTitle1"),
      titleTwo: t("home.offers.offer1.title2"),
      subTitleTwo: t("home.offers.offer1.subTitle2"),
    },
    {
      icon: faMessage,
      titleOne: t("home.offers.offer2.title1"),
      subTitleOne: t("home.offers.offer2.subTitle1"),
      titleTwo: t("home.offers.offer2.title2"),
      subTitleTwo: t("home.offers.offer2.subTitle2"),
    },
    {
      icon: faLock,
      titleOne: t("home.offers.offer3.title1"),
      subTitleOne: t("home.offers.offer3.subTitle1"),
      titleTwo: t("home.offers.offer3.title2"),
      subTitleTwo: t("home.offers.offer3.subTitle2"),
    },
  ];

  const renderOffers = () => {
    return (
      <div className="flex flex-col text-center sm:px-14 lg:flex-row lg:pt-11">
        {offers.map((offer) => {
          return (
            <div
              key={offer.subTitleOne}
              className="pointer-events-none my-5 w-full px-4 lg:w-1/3"
            >
              <div className="hidden lg:block">
                <FontAwesomeIcon icon={offer.icon} className="fa-3x" />
              </div>
              <div className="lg:hidden">
                <FontAwesomeIcon icon={offer.icon} className="fa-2x" />
              </div>
              <div className="py-6 lg:px-11">
                <h2 className="text-lg lg:text-xl">{offer.titleOne}</h2>
                <h3 className="text-base text-gray2">{offer.subTitleOne}</h3>
              </div>
              <div className="py-6 lg:px-11">
                <h2 className="text-lg lg:text-xl">{offer.titleTwo}</h2>
                <h3 className="text-base text-gray2">{offer.subTitleTwo}</h3>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPositivesBoard = (
    title: string,
    positives: string[],
    influencer: boolean
  ) => {
    const iconColor = influencer ? "text-influencer" : "text-influencer-green";
    return (
      <div className="pointer-events-none mt-8 rounded-2xl border-[1px] border-white1 px-4 py-11 text-left shadow-lg sm:mx-11 sm:mt-5 sm:p-11">
        <h1 className="font-playfair text-3xl">{title}</h1>
        <div className="mt-5">
          {positives.map((elem) => {
            return (
              <div key={elem} className="flex items-center gap-4 py-5">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`fa-1x cursor-pointer ${iconColor}`}
                />
                <span className="sm:px-2">{elem}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSectionOne = () => {
    return (
      <div className="flex flex-col items-center pb-16 pt-6 sm:px-5 lg:px-0 lg:py-10">
        <div className="pointer-events-none px-4 text-center font-playfair">
          <h1 className="text-2xl lg:text-5xl">{t("home.section1.title")}</h1>
          <h2 className="p-2 text-xl  text-gray1 lg:p-7 lg:text-3xl">
            {t("home.section1.subtitle")}
          </h2>
        </div>
        <div className="hidden items-center sm:mt-5 sm:flex">
          {brands.map((elem) => {
            return (
              <div key={elem}>
                <div className="hidden lg:block lg:h-auto lg:px-12">
                  <Image
                    src={`/images/${elem}.png`}
                    height={1000}
                    width={1000}
                    style={{ width: "68px", height: "68px" }}
                    alt={elem}
                    className="object-contain"
                  />
                </div>
                <div className="sm:px-3 lg:hidden lg:h-auto lg:px-12">
                  <Image
                    src={`/images/${elem}.png`}
                    height={1000}
                    width={1000}
                    style={{ width: "32px", height: "32px" }}
                    alt={elem}
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <SimpleSearchBar />
      </div>
    );
  };

  const renderSectionTwo = () => {
    return (
      <div className="bg-influencer-green px-4 sm:px-5 lg:px-0">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <h1 className="pointer-events-none font-playfair text-2xl lg:text-5xl">
            {t("home.section2.title")}
          </h1>
          <h2 className="pointer-events-none p-7 font-playfair text-xl text-white lg:text-3xl">
            {t("home.section2.subTitle")}
          </h2>
          {session.status === "authenticated" ? (
            <Link href="/manage-jobs">
              <Button title={t("home.section2.buttonTitle")} level="primary" />
            </Link>
          ) : (
            <Button
              title={t("home.section2.buttonTitle")}
              level="primary"
              onClick={() => params.openLoginModal()}
            />
          )}
        </div>
      </div>
    );
  };

  const renderSectionThree = () => {
    return (
      <div className="flex flex-col items-center py-10 sm:px-5 lg:px-0">
        <div className="pointer-events-none text-center font-playfair">
          <h1 className="text-2xl lg:text-5xl">{t("home.section3.title")}</h1>
        </div>
        {renderOffers()}
        <div className="mb-11 flex flex-col justify-center p-4 lg:flex-row">
          {renderPositivesBoard(
            t("home.positivesBoards.brands.title"),
            [
              t("home.positivesBoards.brands.positive1"),
              t("home.positivesBoards.brands.positive2"),
              t("home.positivesBoards.brands.positive3"),
              t("home.positivesBoards.brands.positive4"),
              t("home.positivesBoards.brands.positive5"),
              t("home.positivesBoards.brands.positive6"),
              t("home.positivesBoards.brands.positive7"),
              t("home.positivesBoards.brands.positive8"),
            ],
            true
          )}
          {renderPositivesBoard(
            t("home.positivesBoards.influencers.title"),
            [
              t("home.positivesBoards.influencers.positive1"),
              t("home.positivesBoards.influencers.positive2"),
              t("home.positivesBoards.influencers.positive3"),
              t("home.positivesBoards.influencers.positive4"),
              t("home.positivesBoards.influencers.positive5"),
              t("home.positivesBoards.influencers.positive6"),
              t("home.positivesBoards.influencers.positive7"),
              t("home.positivesBoards.influencers.positive8"),
            ],
            false
          )}
        </div>
        <div className="flex w-full flex-1 justify-center px-4">
          {session.status === "authenticated" ? (
            <Link href="/explore/influencers">
              <Button title={t("home.section3.buttonTitle")} level="primary" />
            </Link>
          ) : (
            <Button
              title={t("home.section3.buttonTitle")}
              level="primary"
              onClick={() => params.openLoginModal()}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderSectionOne()}
      {renderSectionTwo()}
      {renderSectionThree()}
    </>
  );
};

export { HomePage };
