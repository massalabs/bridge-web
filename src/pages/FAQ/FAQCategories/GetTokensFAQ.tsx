import { AccordionCategory, AccordionContent } from '@massalabs/react-ui-kit';

import {
  TDAI_CONTRACT_ADDRESS,
  WETH_CONTRACT_ADDRESS,
  massaToken,
  supportedTokens,
} from '@/const';
import { FAQProps, FAQcategories, faqURL } from '@/const/faq';
import Intl from '@/i18n/i18n';

export function GetTokensFAQ(props: FAQProps) {
  const { category } = props;

  const showGetEthOnSep = category === FAQcategories.getEthOnSep;
  const showGetWethAndtDai = category === FAQcategories.getWethAndtDai;
  const showGetMasOnMassa = category === FAQcategories.getMasOnMassa;
  return (
    <>
      <AccordionCategory
        state={showGetEthOnSep}
        categoryTitle={Intl.t('index.faq.get-tokens.categories.get-Eth-On-Sep')}
      >
        <AccordionContent>
          <div className="flex flex-col">
            <p className="pr-1.5">
              You need to own some testnet ETH to be able to pay for the
              transaction fees to bridge tokens from Sepolia Testnet to Massa
              Buildnet. You can get 0.5 ETH using this
              <a
                className="underline pl-1.5 pr-1.5"
                href="https://sepoliafaucet.com/"
                target="_blank"
              >
                Sepolia faucet
              </a>
              provided by Alchemy. You can find step-by-step instructions in
              <a
                className="underline pl-1.5"
                href="https://www.web3.university/article/sepolia-eth"
                target="_blank"
              >
                this article
              </a>
              .
            </p>
          </div>
        </AccordionContent>
      </AccordionCategory>
      <AccordionCategory
        state={showGetWethAndtDai}
        categoryTitle={Intl.t(
          'index.faq.get-tokens.categories.get-Weth-And-tDai',
        )}
      >
        <AccordionContent>
          <div className="flex flex-col gap-6">
            <p>
              Massa Bridge currently supports bridging two ERC-20 tokens —{' '}
              {supportedTokens.WETH} and {supportedTokens.tDai} — from Sepolia
              Testnet to Massa Buildnet. You can Mint testnet tokes in the dApp
              above by clicking ‘Get tokens’ once you connect your Metamask
              wallet.
            </p>
            <p>
              You can Mint tokens in the dAPP above by clicking ‘Get tokens’
              once you connect your Metamask wallet.
            </p>
            <p>If you want to do it manually here’s a step-by-step guide:</p>
            <div className="flex flex-col gap-3">
              <div className="text-neutral">Step 1:</div>
              <p>
                Go to Sepolia explorer’s page for
                <a
                  className="underline pl-1.5"
                  href={`https://sepolia.etherscan.io/token/${WETH_CONTRACT_ADDRESS}#writeContract`}
                  target="_blank"
                >
                  {supportedTokens.WETH}
                </a>
                , or for
                <a
                  className="underline pl-1.5"
                  href={`https://sepolia.etherscan.io/token/${TDAI_CONTRACT_ADDRESS}#writeContract`}
                  target="_blank"
                >
                  {supportedTokens.tDai}
                </a>
                .
              </p>
              You can mint tokens directly to your wallet from there.
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-neutral">Step 2: </p>
              <p>
                On the same page, connect your Metamask wallet by clicking on
                the ‘Connect to Web3’ button, under ‘Write Contract’ tab.
              </p>
              <p>
                You should be connected to a Metamask wallet on Sepolia network.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-neutral">Step 3:</div>
              <p>Click on option 4. ‘create’.</p>
              <p> This will open the input field for the ‘to(address)’.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-neutral">Step 4:</div>
              <p>
                Provide the address of your connected Metamask’s wallet. Then
                click on ‘Write’ button.
              </p>
              <p>
                This will, naturally, initiate signing of the transaction in
                your Metamask.
              </p>
            </div>
            <div>
              <div className="text-neutral">Step 5:</div>
              <p>
                Sign the transaction in Metamask. For this you need to have some
                ETH on Sepolia.
              </p>
              <p>
                If you don’t have enough ETH, get some using a Sepolia faucet.
                You can find step-by-step instructions in
                <a
                  className="underline pl-1.5"
                  href="https://www.web3.university/article/sepolia-eth"
                  target="_blank"
                >
                  this article
                </a>
                .
              </p>
            </div>
            <div>
              <div className="text-neutral">Step 6:</div>
              <p>
                To see balances of {supportedTokens.WETH} and{' '}
                {supportedTokens.tDai} in your Metamask, you need to manually
                add a token to Metamask. Check how-to
                <a
                  className="underline pl-1.5"
                  href={faqURL.getTokens.getMasOnMassa}
                >
                  here.
                </a>
                {/* Add redirect Link when it is implemented*/}
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionCategory>
      <AccordionCategory
        state={showGetMasOnMassa}
        categoryTitle={Intl.t(
          'index.faq.get-tokens.categories.get-Mas-On-Massa',
        )}
      >
        <AccordionContent>
          <div className="flex flex-col gap-6">
            <p>
              To Redeem tokens from Massa Buildnet to Sepolia testnet, you need
              some Massa coins ({massaToken}) to pay for the transaction fees.
            </p>

            <div className="flex flex-col gap-3">
              <p className="text-neutral">Step 1:</p>
              <p>
                Go to the Buildnet faucet provided in this
                <a
                  className="underline pl-1.5"
                  href="https://discord.com/channels/828270821042159636/1097797634065956915"
                  target="_blank"
                >
                  Discord channel
                </a>
                .
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-neutral">Step 2:</div>
              <p> Provide your account address in a message.</p>
              <p> You can find it in details of your Massa wallet account.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-neutral">Step 3:</div>
              <p>
                In a few moments you should see that your Massa wallet balance
                changed.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionCategory>
    </>
  );
}
