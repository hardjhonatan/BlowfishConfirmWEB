import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Token Hub - Create SPL Tokens on the Solana Blockchain</title>
        <meta
          name="description"
          content="Create SPL tokens on the Solana blockchain quickly and securely with Solana Token Hub. Our intuitive platform allows you to customize and launch your tokens in minutes. Try it now!
"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
