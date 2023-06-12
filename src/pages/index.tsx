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

const Home: NextPage = () => {
  // const { data: categories } = api.categories.getAll.useQuery();

  const brands = [
    "instagram",
    "twitter",
    "facebook",
    "linkedin",
    "pinterest",
    "twitch",
  ];

  const renderBrandIcons = () => {
    return (
      <div className="flex items-center">
        {brands.map((elem) => {
          return (
            <div key={elem} className="px-12">
              <Image
                src={`/images/${elem}.png`}
                height={68}
                width={68}
                alt="Instagram"
                className="h-auto object-contain"
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderSectionOneTitle = () => {
    return (
      <>
        <h1 className="pointer-events-none font-playfair text-5xl">
          Find The Right Influencer For You
        </h1>
        <h2 className="pointer-events-none p-7 font-playfair text-3xl text-gray1">
          Everyone can choose how to influence
        </h2>
      </>
    );
  };

  const renderSectionTwoTitle = () => {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="pointer-events-none font-playfair text-5xl">
          Don&apos;t know where to choose from?
        </h1>
        <h2 className="pointer-events-none p-7 font-playfair text-3xl text-white">
          Tell us what you need and let influencers come to you instead
        </h2>
        <Button title="Create Offer" />
      </div>
    );
  };

  const renderSectionThreeTitle = () => {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="pointer-events-none font-playfair text-5xl">
          Everything You Need Made Simple
        </h1>
      </div>
    );
  };

  const renderOffer = (
    icon: IconDefinition,
    titleOne: string,
    subTitleOne: string,
    titleTwo: string,
    subTitleTwo: string
  ) => {
    return (
      <div className="pointer-events-none">
        <FontAwesomeIcon icon={icon} className="fa-3x" />
        <div className="p-6 ">
          <h2 className="text-xl">{titleOne}</h2>
          <h3 className="text-base text-gray2">{subTitleOne}</h3>
        </div>
        <div>
          <h2 className="text-xl">{titleTwo}</h2>
          <h3 className="text-base text-gray2">{subTitleTwo}</h3>
        </div>
      </div>
    );
  };

  const renderPositivesBoard = (
    title: string,
    positives: string[],
    color: string
  ) => {
    return (
      <div className="pointer-events-none m-5 rounded-2xl p-11 text-left shadow-lg">
        <h1 className="font-playfair text-3xl">{title}</h1>
        <div className="mt-5">
          {positives.map((elem) => {
            return (
              <div key={elem} className="py-5">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`fa-1x cursor-pointer text-${color}`}
                />
                <span className="px-2">{elem}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-full text-center">
        <div className="flex flex-col items-center py-10">
          {renderSectionOneTitle()}
          {renderBrandIcons()}
          <SearchBar />
        </div>
        <div className="bg-influencer-green">{renderSectionTwoTitle()}</div>
        <div className="flex flex-col items-center py-10">
          {renderSectionThreeTitle()}
          <div className="flex">
            {renderOffer(
              faHandHoldingDollar,
              "Pay on Delivery",
              "Find influencers. Plan campaigns, only pay when the work is done",
              "10% Marketplace Fee",
              "No plans, no subscriptions, only 10% transaction fee"
            )}
            {renderOffer(
              faMessage,
              "Instant Messaging",
              "Communication is key for success,  instant messaging is always available",
              "List of Contacts",
              "Create a list of your most important contacts and reach out when you need"
            )}
            {renderOffer(
              faLock,
              "Safe Transactions",
              "Complete payment protection until you give final approval",
              "Verified Influencers",
              "Vetting process ensures professional content from all influencers"
            )}
          </div>
          <div className="mt-11 flex justify-center">
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
              "influencer"
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
              "influencer-green"
            )}
          </div>
          <Button title="Get Started" />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
