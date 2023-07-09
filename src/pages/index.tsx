import { type NextPage } from "next";
import { HomePage } from "../pageComponents/HomePage/HomePage";
import { CustomHead } from "../components/CustomHead";

const Home: NextPage = () => {
  return (
    <>
      <CustomHead />
      <HomePage />;
    </>
  );
};

export default Home;
