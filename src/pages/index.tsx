import { type NextPage } from "next";

import { api } from "~/utils/api";
import { Layout } from "../components/Layout/Layout";
import { Button } from "../components/Button/Button";
import { SearchBar } from "../components/SearchBar/SearchBar";

const Home: NextPage = () => {
  // const { data: categories } = api.categories.getAll.useQuery();

  const renderBrandIcons = () => {
    return <div>dkoadkao</div>;
  };

  const renderSectionOneTitle = () => {
    return (
      <>
        <h1 className="font-playfair text-5xl">
          Find The Right Influencer For You
        </h1>
        <h2 className="p-7 font-playfair text-3xl text-gray1">
          Everyone can choose how to influence
        </h2>
      </>
    );
  };

  const renderSectionTwoTitle = () => {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="font-playfair text-5xl">
          Don&apos;t know where to choose from?
        </h1>
        <h2 className="p-7 font-playfair text-3xl text-white">
          Tell us what you need and let influencers come to you instead
        </h2>
        <Button title="Create Offer" />
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
      </div>
    </Layout>
  );
};

export default Home;
