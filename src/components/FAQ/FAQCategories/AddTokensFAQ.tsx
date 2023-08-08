import { FAQCategory, FAQContent } from '@massalabs/react-ui-kit';

export function AddTokensFAQ() {
  return (
    <>
      <FAQCategory categoryTitle={'Add tokens to your Massa wallet'}>
        <FAQContent>
          <div className="text-neutral">Step 1:</div>
          <br />
          Go to Massa wallet’s{' '}
          <a
            className="underline"
            href="https://station.massa/plugin/massa-labs/massa-wallet/web-app/account-select"
          >
            Assets page
          </a>
          .
          <br /> <br />
          <div className="text-neutral">Step 2:</div>
          <br />
          Click on ‘Import token’.
          <br /> <br />
          <div className="text-neutral">Step 3:</div>
          <br />
          Provide token hashes for: <br /> mtDAI: <br /> mWETH:
          <br /> <br />
          <div className="text-neutral">Step 4:</div>
          <br />
          Click ‘Add token’.
        </FAQContent>
      </FAQCategory>
      <FAQCategory categoryTitle={'Add tokens to your Metamask'}>
        <FAQContent>
          Follow the instructions on ‘How to add a custom token’{' '}
          <a href="https://support.metamask.io/hc/en-us/articles/360015489031#h_01FWH492CHY60HWPC28RW0872H">
            provided here
          </a>
          .
          <br /> <br />
          by Metamask. For{' '}
          <a
            className="underline"
            href="https://sepolia.etherscan.io/token/0x53844f9577c2334e541aec7df7174ece5df1fcf0"
          >
            tDAI
          </a>
          , provide this address hash:
          0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0
          <br />
          Symbol: tDAI
          <br />
          Decimals: 18
          <br /> <br />
          For{' '}
          <a
            className="underline"
            href="https://sepolia.etherscan.io/address/0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424"
          >
            WETH
          </a>
          , provide this hash: 0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424
          <br />
          Symbol: WETH
          <br />
          Decimals: 18
        </FAQContent>
      </FAQCategory>
    </>
  );
}
