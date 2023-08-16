import { FAQCategory, FAQContent } from '@massalabs/react-ui-kit';

import {
  TDAI_CONTRACT_ADDRESS,
  WETH_CONTRACT_ADDRESS,
  supportedtokens,
} from '@/const';

export function AddTokensFAQ() {
  return (
    <>
      <FAQCategory categoryTitle={'Add tokens to your Massa wallet'}>
        <FAQContent>
          <div className="text-neutral">Step 1:</div>
          <br />
          <a
            className="underline"
            href="https://station.massa/plugin/massa-labs/massa-wallet/web-app/account-select"
            target="_blank"
          >
            Open Massa Wallet
          </a>{' '}
          and select the account to which your bridged tokens.
          <br /> <br />
          <div className="text-neutral">Step 2:</div>
          <br />
          From the menu on the right, click on ‘Assets’.
          <br /> <br />
          <div className="text-neutral">Step 3:</div>
          <br />
          Click on ‘Import token’. You will need to provide the smart-contract
          address of a token you want to add. <br />
          <br />
          Use these Smart contract addresses to see your balance: <br />
          <br />
          [token name]({supportedtokens.tDai}) -
          AS12TRoScMdwLK8Ypt6NBAppyzCFw7QeG5e3xFvxpCAnAnYLfuM
          <br />
          <br /> [token name] ({supportedtokens.WETH}) -
          AS12f7ENiyqABrC4yTeAsKVyneRyG1MJ1w7dy6xFo5tn3xmytBMNz
          <br /> <br />
          <div className="text-neutral">Step 4:</div>
          <br />
          Click ‘Add token’. <br />
          You should see the fungible token and its corresponding balance for
          your wallet account.
        </FAQContent>
      </FAQCategory>
      <FAQCategory categoryTitle={'Add tokens to your Metamask'}>
        <FAQContent>
          You must add tDAI and WETH to Metamask in order to see the balance of
          each token your wallet holds.
          <br /> <br />
          <div className="text-neutral">Step 1:</div>
          <br />
          Follow the instructions on <b>How to add a custom token </b>
          <a
            className="underline"
            href="https://support.metamask.io/hc/en-us/articles/360015489031#h_01FWH492CHY60HWPC28RW0872H"
            target="_blank"
          >
            provided here
          </a>{' '}
          by Metamask.
          <br /> <br />
          For{' '}
          <a
            className="underline"
            href="https://sepolia.etherscan.io/token/0x53844f9577c2334e541aec7df7174ece5df1fcf0"
            target="_blank"
          >
            {supportedtokens.tDai}
          </a>
          , provide this address : {TDAI_CONTRACT_ADDRESS}
          <br />
          Symbol: {supportedtokens.tDai}
          <br />
          Decimals: 18
          <br /> <br />
          For{' '}
          <a
            className="underline"
            href="https://sepolia.etherscan.io/address/0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424"
            target="_blank"
          >
            {supportedtokens.WETH}
          </a>
          , provide this address: {WETH_CONTRACT_ADDRESS}
          <br />
          Symbol: {supportedtokens.WETH}
          <br />
          Decimals: 18
        </FAQContent>
      </FAQCategory>
    </>
  );
}
