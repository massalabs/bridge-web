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
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-neutral">Step 1:</p>
              <div className="flex">
                <a
                  className="underline pr-1.5"
                  href="https://station.massa/plugin/massa-labs/massa-wallet/web-app/account-select"
                  target="_blank"
                >
                  Open Massa Wallet
                </a>
                <p> and select the account to which you bridged tokens.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-neutral">Step 2:</p>
              <p>From the menu on the right, click on ‘Assets’.</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-neutral">Step 3:</p>
              <p>
                Click on ‘Import token’. You will need to provide the
                smart-contract address of a token you want to add.
              </p>
              <p> Use these Smart contract addresses to see your balance: </p>
              <p>
                {supportedtokens.tDai} -
                AS12TRoScMdwLK8Ypt6NBAppyzCFw7QeG5e3xFvxpCAnAnYLfuM
              </p>
              <p>
                {supportedtokens.WETH} -
                AS12f7ENiyqABrC4yTeAsKVyneRyG1MJ1w7dy6xFo5tn3xmytBMNz
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-neutral">Step 4:</p>
              <p>Click on ‘Add token’. </p>
              <p>
                You should see the fungible token and its corresponding balance
                for your wallet account.
              </p>
            </div>
          </div>
        </FAQContent>
      </FAQCategory>
      <FAQCategory categoryTitle={'Add tokens to your Metamask'}>
        <FAQContent>
          <div className="flex flex-col gap-6">
            <p>
              You must add tDAI and WETH to Metamask in order to see the balance
              of each token your wallet holds.
            </p>
            <div className="flex flex-col gap-3">
              <div className="text-neutral">Step 1:</div>
              <div>
                Follow the instructions on <b>How to add a custom token </b>
                <a
                  className="underline pr-1.5"
                  href="https://support.metamask.io/hc/en-us/articles/360015489031#h_01FWH492CHY60HWPC28RW0872H"
                  target="_blank"
                >
                  provided here
                </a>
                by Metamask.
              </div>
              <div className="flex flex-col">
                <p>
                  For
                  <a
                    className="underline pl-1.5"
                    href="https://sepolia.etherscan.io/token/0x53844f9577c2334e541aec7df7174ece5df1fcf0"
                    target="_blank"
                  >
                    {supportedtokens.tDai}
                  </a>
                  , provide this address: {TDAI_CONTRACT_ADDRESS}
                </p>
                <p> Symbol: {supportedtokens.tDai}</p>
                <p> Decimals: 18</p>
              </div>
              <div className="flex flex-col">
                <p>
                  For
                  <a
                    className="underline pl-1.5"
                    href="https://sepolia.etherscan.io/address/0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424"
                    target="_blank"
                  >
                    {supportedtokens.WETH}
                  </a>
                  , provide this address: {WETH_CONTRACT_ADDRESS}
                </p>
                <p> Symbol: {supportedtokens.WETH}</p>
                <p> Decimals: 18</p>
              </div>
            </div>
          </div>
        </FAQContent>
      </FAQCategory>
    </>
  );
}
