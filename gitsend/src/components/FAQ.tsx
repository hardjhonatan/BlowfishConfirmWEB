import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="title-centr">Frequently Asked Questions</h2>
      <div className="faq-item" onClick={() => toggleFaq(0)}>
        <div className="faq-question">What is the Solana Token Creator?</div>
        <div className={`faq-answer ${activeIndex === 0 ? 'active' : ''}`}>
          Solana Token Creator is a tool that allows you to easily create Solana SPL tokens without needing to code.
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFaq(1)}>
        <div className="faq-question">Is it Safe to Create Solana Tokens here?</div>
        <div className={`faq-answer ${activeIndex === 1 ? 'active' : ''}`}>
          Yes, it is safe. We ensure the security of your token creation process.
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFaq(2)}>
        <div className="faq-question">How much time will the Solana Token Creator Take?</div>
        <div className={`faq-answer ${activeIndex === 2 ? 'active' : ''}`}>
          It takes less than 5 minutes to create a token.
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFaq(3)}>
        <div className="faq-question">How much does it cost?</div>
        <div className={`faq-answer ${activeIndex === 3 ? 'active' : ''}`}>
          The cost of token creation is 0.3 SOL.
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFaq(4)}>
        <div className="faq-question">Which wallet can I use?</div>
        <div className={`faq-answer ${activeIndex === 4 ? 'active' : ''}`}>
          You can use any Solana-compatible wallet.
        </div>
      </div>
      <div className="faq-item" onClick={() => toggleFaq(5)}>
        <div className="faq-question">How many tokens can I create for each decimal amount?</div>
        <div className={`faq-answer ${activeIndex === 5 ? 'active' : ''}`}>
          The number of tokens you can create depends on the specified decimal amount.
        </div>
      </div>
    </div>
  );
};

export default FAQ;
