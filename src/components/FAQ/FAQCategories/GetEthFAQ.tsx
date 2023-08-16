import { FAQCategory, FAQContent } from '@massalabs/react-ui-kit';

import {
  TDAI_CONTRACT_ADDRESS,
  WETH_CONTRACT_ADDRESS,
  supportedtokens,
} from '@/const';

export function GetEthFAQ() {
  return (
    <>
      {' '}
      <FAQCategory categoryTitle={'Get ETH on Sepolia'}>
        <FAQContent>
          <div>
            You need to own some testnet ETH to be able to pay for the
            transaction fees to bridge tokens from Sepolia Testnet to Massa
            Buildnet. You can get 0.5 ETH using this{' '}
            <a className="underline" href="https://sepoliafaucet.com/">
              target="_blank" Sepolia faucet
            </a>{' '}
            provided by Alchemy. You can find step-by-step instructions in{' '}
            <a
              className="underline"
              href="https://www.web3.university/article/sepolia-eth"
              target="_blank"
            >
              this article
            </a>
            .
          </div>
        </FAQContent>
      </FAQCategory>
      <FAQCategory categoryTitle={'Get WETH and tDAI on Sepolia'}>
        <FAQContent>
          <div>
            Massa Bridge supports bridging two ERC-20 tokens —{' '}
            {supportedtokens.WETH} and {supportedtokens.tDai} — from Sepolia
            Testnet to Massa Buildnet, at the moment. <br />
            <br />
            You can Mint tokens in the dAPP above by clicking ‘Get tokens’ once
            you connect your Metamask wallet.
            <br />
            <br /> If you want to do it manually here’s a step-by-step guide:
            <br /> <br />
            <div>
              <div className="text-neutral">Step 1:</div>
              <br />
              Go to Sepolia explorer’s page for{' '}
              <a
                className="underline"
                href={`https://sepolia.etherscan.io/token/${WETH_CONTRACT_ADDRESS}#writeContract`}
                target="_blank"
              >
                {supportedtokens.WETH}
              </a>
              , or for{' '}
              <a
                className="underline"
                href={`https://sepolia.etherscan.io/token/${TDAI_CONTRACT_ADDRESS}#writeContract`}
                target="_blank"
              >
                {supportedtokens.tDai}
              </a>
              .
              <br />
              You can mint tokens directly to your wallet from there.
              <br /> <br />
              <div className="text-neutral">Step 2:</div>
              <br />
              On the same page, connect your Metamask wallet by clicking on the
              ‘Connect to Web3’ button, under ‘Write Contract’ tab.
              <br /> You should be connected to a Metamask wallet on Sepolia
              network.
              <br /> <br />
              <div className="text-neutral">Step 3:</div>
              <br />
              Click on option 4. ‘create’. <br />
              This will open the input field for the ‘to(address)’.
              <br /> <br />
              <div className="text-neutral">Step 4:</div>
              <br />
              Provide the address of your connected Metamask’s wallet. Then
              click on ‘Write’ button.
              <br /> This will, naturally, initiate signing of the transaction
              in your Metamask.
              <br /> <br />
              <div className="text-neutral">Step 5:</div>
              <br />
              Sign the transaction in Metamask. For this you need to have some
              ETH on Sepolia. <br />
              If you don’t have enough ETH, get some using a Sepolia faucet. You
              can find step-by-step instructions in{' '}
              <a
                className="underline"
                href="https://www.web3.university/article/sepolia-eth"
                target="_blank"
              >
                this article
              </a>
              .
              <br /> <br />
              <div className="text-neutral">Step 6:</div>
              <br />
              To see balances of {supportedtokens.WETH} and{' '}
              {supportedtokens.tDai} in your Metamask, you need to manually add
              a token to Metamask. Check how-to here.
            </div>
          </div>
        </FAQContent>
      </FAQCategory>
      <FAQCategory categoryTitle={'Get XMA on Massa Buildnet wallet'}>
        <FAQContent>
          To Redeem tokens from Massa Buildnet to Sepolia testnet, you need some
          Massa coins (XMA) to pay for the transaction fees.
          <br /> <br />
          <div className="text-neutral">Step 1:</div>
          <br />
          Go to the Buildnet faucet provided in this{' '}
          <a
            className="underline"
            href="https://discord.com/channels/828270821042159636/1097797634065956915"
            target="_blank"
          >
            Discord channel
          </a>
          .
          <br /> <br />
          <div className="text-neutral">Step 2:</div>
          <br />
          Provide the address of your account address in a message.
          <br /> You can find it in details of your Massa wallet account.
          <br /> <br />
          <div className="text-neutral">Step 3:</div>
          <br />
          In a few moments you should see that your Massa wallet balance
          changed.
        </FAQContent>
      </FAQCategory>
    </>
  );
}
