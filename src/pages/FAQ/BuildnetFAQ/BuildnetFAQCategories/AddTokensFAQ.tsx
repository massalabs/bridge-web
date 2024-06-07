import { AccordionCategory, AccordionContent } from '@massalabs/react-ui-kit';
import { bscTestnet, sepolia } from 'viem/chains';
import { FAQProps, FAQcategories } from '@/const/faq';
import Intl from '@/i18n/i18n';
import { IToken, useTokenStore } from '@/store/tokenStore';
import { bscScanTokenLink, sepoliaEtherscanTokenLink } from '@/utils/const';

export function AddTokensFAQ(props: FAQProps) {
  const { category } = props;

  const { tokens } = useTokenStore();

  const showAddToMassa = category === FAQcategories.addToMassa;
  const showAddToMetamask = category === FAQcategories.addToMetamask;

  const filteredBscTokens = tokens.filter(
    (token) => token.chainId === bscTestnet.id,
  );

  const filteredEthTokens = tokens.filter(
    (token) => token.chainId === sepolia.id,
  );
  return (
    <>
      <AccordionCategory
        state={showAddToMassa}
        categoryTitle={Intl.t('index.faq.add-tokens.categories.add-To-Massa')}
      >
        <AccordionContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-neutral">Step 1:</p>
              <a
                className="underline pr-1.5"
                href="https://station.massa/plugin/massa-labs/massa-wallet/web-app/account-select"
                target="_blank"
              >
                Open Massa Wallet
              </a>
              <p> and select the account to which you bridged tokens.</p>
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
              {tokens.map((token: IToken, index) => (
                <p key={index}>
                  {token.symbol} - {token.massaToken}
                </p>
              ))}
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
        </AccordionContent>
      </AccordionCategory>
      <AccordionCategory
        state={showAddToMetamask}
        categoryTitle={Intl.t(
          'index.faq.add-tokens.categories.add-To-Metamask',
        )}
      >
        <AccordionContent>
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
              {filteredEthTokens.map((token: IToken, index) => (
                <div className="flex flex-col" key={index}>
                  <p>
                    For
                    <a
                      className="underline pl-1.5"
                      href={`${sepoliaEtherscanTokenLink}${token.evmToken}`}
                      target="_blank"
                    >
                      {token.name}
                    </a>
                    , provide this address: {token.evmToken}
                  </p>
                  <p> Symbol: {token.symbolEVM}</p>
                  <p> Decimals: {token.decimals}</p>
                </div>
              ))}
              {filteredBscTokens.map((token: IToken, index) => (
                <div className="flex flex-col" key={index}>
                  <p>
                    For
                    <a
                      className="underline pl-1.5"
                      href={`${bscScanTokenLink}${token.evmToken}`}
                      target="_blank"
                    >
                      {token.name}
                    </a>
                    , provide this address: {token.evmToken}
                  </p>
                  <p> Symbol: {token.symbolEVM}</p>
                  <p> Decimals: {token.decimals}</p>
                </div>
              ))}
              {filteredBscTokens.map((token: IToken, index) => (
                <div className="flex flex-col" key={index}>
                  <p>
                    For
                    <a
                      className="underline pl-1.5"
                      href={`https://testnet.bscscan.com/address/${token.evmToken}`}
                      target="_blank"
                    >
                      {token.name}
                    </a>
                    , provide this address: {token.evmToken}
                  </p>
                  <p> Symbol: {token.symbolEVM}</p>
                  <p> Decimals: {token.decimals}</p>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionCategory>
    </>
  );
}
