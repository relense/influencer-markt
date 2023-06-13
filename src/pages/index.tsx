import { type NextPage } from "next";

import { api } from "~/utils/api";
import { Layout } from "../components/Layout/Layout";
import { Button } from "../components/Button/Button";
import { SearchBar } from "../components/SearchBar/SearchBar";
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

type Offer = {
  icon: IconDefinition;
  titleOne: string;
  subTitleOne: string;
  titleTwo: string;
  subTitleTwo: string;
};

const brands = [
  "instagram",
  "twitter",
  "facebook",
  "linkedin",
  "pinterest",
  "twitch",
];

const offers: Offer[] = [
  {
    icon: faHandHoldingDollar,
    titleOne: "Pay on Delivery",
    subTitleOne:
      "Find influencers. Plan campaigns, only pay when the work is done",
    titleTwo: "10% Marketplace Fee",
    subTitleTwo: "No plans, no subscriptions, only 10% transaction fee",
  },
  {
    icon: faMessage,
    titleOne: "Instant Messaging",
    subTitleOne:
      "Communication is key for success,  instant messaging is always available",
    titleTwo: "List of Contacts",
    subTitleTwo:
      "Create a list of your most important contacts and reach out when you need",
  },
  {
    icon: faLock,
    titleOne: "Safe Transactions",
    subTitleOne: "Complete payment protection until you give final approval",
    titleTwo: "Verified Influencers",
    subTitleTwo:
      "Vetting process ensures professional content from all influencers",
  },
];

const Home: NextPage = () => {
  // const { data: categories } = api.categories.getAll.useQuery();

  const renderOffers = () => {
    return (
      <div className="flex flex-col px-14 text-center lg:flex-row lg:pt-11">
        {offers.map((offer) => {
          return (
            <div key={offer.subTitleOne} className="pointer-events-none my-5">
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
      <div className="pointer-events-none mx-11 mt-5 rounded-2xl border-[1px] border-border-white p-11 text-left shadow-lg">
        <h1 className="font-playfair text-3xl">{title}</h1>
        <div className="mt-5">
          {positives.map((elem) => {
            return (
              <div key={elem} className="flex items-center py-5">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`fa-1x cursor-pointer ${iconColor}`}
                />
                <span className="px-2">{elem}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSectionOne = () => {
    return (
      <div className="flex flex-col items-center px-5 py-10 lg:px-0">
        <div className="pointer-events-none text-center font-playfair">
          <h1 className="text-2xl lg:text-5xl">
            Find The Right Influencer For You
          </h1>
          <h2 className="p-2 text-xl  text-gray1 lg:p-7 lg:text-3xl">
            Everyone can choose how to influence
          </h2>
        </div>
        <div className="mt-5 flex items-center">
          {brands.map((elem) => {
            return (
              <div key={elem}>
                <div className="hidden lg:block lg:h-auto lg:px-12">
                  <Image
                    src={`/images/${elem}.png`}
                    height={68}
                    width={68}
                    alt="Instagram"
                    className="object-contain"
                  />
                </div>
                <div className="px-3 lg:hidden lg:h-auto lg:px-12">
                  <Image
                    src={`/images/${elem}.png`}
                    height={32}
                    width={32}
                    alt="Instagram"
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <SearchBar />
      </div>
    );
  };

  const renderSectionTwo = () => {
    return (
      <div className="bg-influencer-green px-5 lg:px-0">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <h1 className="pointer-events-none font-playfair text-2xl lg:text-5xl">
            Don&apos;t know where to choose from?
          </h1>
          <h2 className="pointer-events-none p-7 font-playfair text-xl text-white lg:text-3xl">
            Tell us what you need and let influencers come to you instead
          </h2>
          <Button title="Create Offer" />
        </div>
      </div>
    );
  };

  const renderSectionThree = () => {
    return (
      <div className="flex flex-col items-center px-5 py-10 lg:px-0">
        <div className="pointer-events-none text-center font-playfair">
          <h1 className="text-2xl lg:text-5xl">
            Everything You Need Made Simple
          </h1>
        </div>
        {renderOffers()}
        <div className="mb-11 mt-11 flex flex-col justify-center lg:flex-row">
          {renderPositivesBoard(
            "For Brands and Individuals",
            [
              "Unlimited searches of the best influencers for you",
              "Ability to create offers for the influencer you want",
              "Save influencers for future campaigns ",
              "Unlimited campaigns",
              "Unlimited influencers can apply to your campaign",
              "Rate Influencers",
              "Chat with influencers before working together",
              "Recommended influencers for your needs",
            ],
            true
          )}
          {renderPositivesBoard(
            "For Influencers",
            [
              "Be part of a community",
              "Follow other influencers and trade ideas",
              "Dedicated profile page to share with brands",
              "Offers page tailored to your needs",
              "Rewards based on performance",
              "Ability to review the job",
              "Offers page tailored",
              "Find the best brand for you and introduce yourself",
            ],
            false
          )}
        </div>
        <Button title="Get Started" />
      </div>
    );
  };

  return (
    <Layout>
      {renderSectionOne()}
      {renderSectionTwo()}
      {renderSectionThree()}
    </Layout>
  );
};

export default Home;
