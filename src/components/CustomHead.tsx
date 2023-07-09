import Head from "next/head";

const CustomHead = () => {
  return (
    <Head>
      <title>Influencer Market</title>
      <meta
        name="description"
        content="A Market to find your favorite influencers"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export { CustomHead };
