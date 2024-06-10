import React, { useState, FC } from 'react';

export const Footer: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    console.log('toggleFaq', index);
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div className="text-space3 cardtext">
        <h2 className="title">Solana SPL Token Generator</h2>
        <ol className="texts">
          <li className="textsin">If you are looking for a practical and effective way to create SPL tokens on the Solana blockchain, our online SPL token generator is the perfect solution. Our user-friendly and intuitive platform allows users to customize and launch their tokens in minutes.
            Our SPL token generator removes the need for expertise in blockchain technology; anyone can easily create and manage their tokens. Additionally, we prioritize the security and privacy of our users. All transactions and token information are protected by our on-chain smart contract, ensuring the security of your assets during and after the process.
            We aim to provide users with a smooth and efficient experience in creating SPL tokens on the Solana blockchain. With our online generator, you can personalize your tokens with unique logos, descriptions, and issuance details, making them unique and reflective of your brand or project.</li><br></br>
        </ol>

        <h2 className="title">Why Create Solana Tokens Using SolTokenHub</h2>
        <ol className="texts">
          <li className="textsin">Whether you are an experienced developer or just starting, our SPL Token Generator software is designed for you. Experience the ease of quickly and securely generating tokens, saving valuable time and resources. What sets us apart is our unwavering commitment to exceptional support.
          </li><br></br>
        </ol>
        
        <h2 className="title">Why Create Solana Tokens Using SolTokenHub</h2>
        <ol className="texts">
          <li className="textsin">Whether you are an experienced developer or just starting, our SPL Token Generator software is designed for you. Experience the ease of quickly and securely generating tokens, saving valuable time and resources. What sets us apart is our unwavering commitment to exceptional support.
            Our dedicated team of experts is available 24/7 to address any inquiries or challenges you may encounter. Start your journey of creating and managing SPL tokens on Solana today with confidence, knowing that our reliable and secure online generator offers an unparalleled experience. You not find a more user-friendly and efficient solution elsewhere!
          </li><br></br>
        </ol>

      </div>
      <div className="faq-container">
        <h2 className="title-centr">Frequently Asked Questions</h2>
        <div className="faq-item" onClick={() => toggleFaq(0)}>
          <div className="faq-question">What is the Solana Token Creator?</div>
          <div className={`faq-answer ${activeIndex === 0 ? 'active' : ''}`}>
            The Orion Tools Solana Token Creator is an advanced Smart Contract empowering users to effortlessly generate customized SPL Tokens (Solana tokens), specifically tailored to their preferences in terms of supply, name, symbol, description, and image on the Solana Chain. Making tokens is super quick and cheap with our easy process.
          </div>
        </div>
        <div className="faq-item" onClick={() => toggleFaq(1)}>
          <div className="faq-question">Is it Safe to Create Solana Tokens here?</div>
          <div className={`faq-answer ${activeIndex === 1 ? 'active' : ''}`}>
            Yes, our tools is completely safe. It is a dApp that creates your token, giving you and only you the mint and freeze Authority (the control of a SPL Token). Our dApp is audited and used by hundred of users every month.
          </div>
        </div>
        <div className="faq-item" onClick={() => toggleFaq(2)}>
          <div className="faq-question">How much time will the Solana Token Creator Take?</div>
          <div className={`faq-answer ${activeIndex === 2 ? 'active' : ''}`}>
            The time of your Token Creation depends on the TPS Status of Solana. It usually takes just a few seconds so do not worry. If you have any issue please contact us.
          </div>
        </div>
        <div className="faq-item" onClick={() => toggleFaq(3)}>
          <div className="faq-question">How much does it cost?</div>
          <div className={`faq-answer ${activeIndex === 3 ? 'active' : ''}`}>
            The token creation currently cost 0.3 Sol, it includes all fees necessaries for the Token Creation in Solana mainnet.
          </div>
        </div>
        <div className="faq-item" onClick={() => toggleFaq(4)}>
          <div className="faq-question">Which wallet can I use?</div>
          <div className={`faq-answer ${activeIndex === 4 ? 'active' : ''}`}>
            You can use any Solana Wallet as Phantom, Solflare, Backpack, etc.
          </div>
        </div>
        <div className="faq-item" onClick={() => toggleFaq(5)}>
          <div className="faq-question">How many tokens can I create for each decimal amount?</div>
          <div className={`faq-answer ${activeIndex === 5 ? 'active' : ''}`}>
            Here is the max amount of tokens you can create for each decimal range.
            <br />
            0 to 4 - 1,844,674,407,370,955
            <br />
            5 to 7 - 1,844,674,407,370
            <br />
            8 - 184,467,440,737
            <br />
            9 - 18,446,744,073
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <footer className="border-t-2 border-[#141414] bg-black hover:text-white absolute w-full">
          <div className="ml-12 py-12 mr-12">
            <div className="flex justify-center">
              <div className="mb-6 items-center mx-auto max-w-screen-lg">
                <h5 className="font-normal capitalize tracking-tight  mb-2.5">
                  Need Support? Contact us: support@soltohenhub.com
                </h5>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
