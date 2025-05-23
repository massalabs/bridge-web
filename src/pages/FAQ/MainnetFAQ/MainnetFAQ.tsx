import { useRef, useEffect } from 'react';
import { Accordion, AccordionContent } from '@massalabs/react-ui-kit';
import { SupportedEvmBlockchain, config } from '@/const';
import {
  FAQsections,
  bridgeEmail,
  HOW_TO_BRIDGE_LINK,
  bridgeUrl,
  bridgeWmasPageLink,
  discordSupportChannel,
} from '@/const/faq';
import { useQuery } from '@/custom/api/useQuery';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import {
  AIRDROP_AMOUNT,
  BEARBY_INSTALL,
  MASSA_STATION_FAQ,
  MASSA_STATION_INSTALL,
  MASSA_WALLET_CREATE_ACCOUNT_FAQ,
} from '@/utils/const';

export function MainnetFAQ() {
  const query = useQuery();
  const { tokens } = useTokenStore();
  const { currentMode } = useBridgeModeStore();

  const addTokensToMassaRef = useRef<HTMLDivElement | null>(null);
  const bridgeWmasRef = useRef<HTMLDivElement | null>(null);

  const sectionToNavigate: string | null = query.get('section');

  const navigateToAddTokens = sectionToNavigate === FAQsections.addTokens;
  const navigateToBridgeWmas = sectionToNavigate === FAQsections.bridgeWmas;

  useEffect(() => {
    if (sectionToNavigate) {
      if (navigateToAddTokens && addTokensToMassaRef.current) {
        addTokensToMassaRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (navigateToBridgeWmas && bridgeWmasRef.current) {
        bridgeWmasRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [sectionToNavigate, navigateToAddTokens, navigateToBridgeWmas]);

  return (
    <div className="w-1/2 flex flex-col gap-5 items-center">
      <div>
        <p className="mas-title text-neutral">{Intl.t('navbar.faq')}</p>
      </div>
      <div ref={bridgeWmasRef}></div>
      <Accordion
        title={'How to claim WMAS from DAO Maker sale'}
        state={navigateToBridgeWmas}
      >
        <AccordionContent>
          <p>
            1. Navigate to the{' '}
            <u>
              <a href={bridgeWmasPageLink} target="_blank">
                DAO Maker Claim
              </a>
            </u>{' '}
            page. Make sure you’re on Mainnet mode in the upper-right corner.
          </p>
          <p>2. Open the Connect Wallet popup from the upper-right corner.</p>
          <p>
            3. Connect the MetaMask wallet with WMAS balance, on the BSC
            network.
          </p>
          <p>4. Connect a Massa wallet account:</p>
          <p className="ml-2">
            Massa Station Wallet (recommended to use): If you haven't, install{' '}
            <u>
              <a href={MASSA_STATION_INSTALL} target="_blank">
                Massa Station
              </a>
            </u>{' '}
            desktop app on your device and create a Massa Wallet account. If you
            have any problems, check{' '}
            <u>
              <a href={MASSA_STATION_FAQ} target="_blank">
                Massa Station FAQ
              </a>
            </u>{' '}
            and{' '}
            <u>
              <a href={MASSA_WALLET_CREATE_ACCOUNT_FAQ} target="_blank">
                Massa Wallet Instructions
              </a>
            </u>
            .
          </p>
          <p className="ml-2">
            An alternative Massa wallet is a community-developed browser
            extension{' '}
            <u>
              <a href={BEARBY_INSTALL} target="_blank">
                Bearby
              </a>
            </u>
            . However due bear in mind that the wallet has not been audited by
            Massa team.
          </p>
          <p>
            5. In the DAO Maker page, enter the desired amount of WMAS to bridge
            in the input field.
          </p>
          <p>6. Click "Bridge".</p>
          <p>
            7. You must sign a transaction on BSC network with your MetaMask
            wallet to initiate the transfer.
          </p>
          <p>
            8. Wait for the transfer to be completed, it can take a couple of
            minutes.
          </p>
          <br />
          <p>
            If you have any doubts on your transaction you can go to the History
            page to verify your transaction's status.
          </p>
          <br />
          {discordSupportChannel && (
            <p>
              If you encounter any technical problems during your bridge drop us
              a message at our
              <a target="_blank" href={discordSupportChannel}>
                Discord Support Channel
              </a>
            </p>
          )}
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.airdrop-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.airdrop-desc', {
              amount: AIRDROP_AMOUNT,
            })}
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.transfer-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.transfer-desc-1')}
            <br /> <br />
            {Intl.t('index.faq.mainnet.transfer-desc-2')}
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.not-visible-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.not-visible-desc-1')}
            <br /> <br />
            {Intl.t('index.faq.mainnet.not-visible-desc-2')}
            <a href={discordSupportChannel}>
              <u> {Intl.t('index.faq.mainnet.not-visible-desc-3')}</u>
            </a>
            .
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.exceed-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.exceed-desc')}
            <a target="_blank" href={`mailto:${bridgeEmail}`}>
              <u>{bridgeEmail}</u>
            </a>
            .
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.bridge-native-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.bridge-native-desc')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.tutorial-title')}>
        <AccordionContent>
          <p>
            {HOW_TO_BRIDGE_LINK ? (
              <div>
                {Intl.t('index.faq.mainnet.tutorial-desc-1')}{' '}
                <a target="_blank" href={HOW_TO_BRIDGE_LINK}>
                  <u>{Intl.t('index.faq.mainnet.tutorial-desc-2')}</u>
                </a>
                {'.'}
              </div>
            ) : (
              Intl.t('index.faq.mainnet.tutorial-empty-desc')
            )}
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.suffix-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.suffix-desc')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.suffix-desc-1')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.suffix-desc-2')}</p>
          <br /> <br />
          <p>{Intl.t('index.faq.mainnet.suffix-desc-3')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.bridge-address-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.bridge-address-desc-1')}{' '}
            {config[currentMode][SupportedEvmBlockchain.ETH]}
          </p>
          <p>
            {Intl.t('index.faq.mainnet.bridge-address-desc-3')}{' '}
            {config[currentMode][SupportedEvmBlockchain.BSC]}
          </p>
          <p>
            {Intl.t('index.faq.mainnet.bridge-address-desc-2')}{' '}
            {config[currentMode].massaBridgeContract}
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.token-address-title')}>
        <AccordionContent>
          {tokens.map((token, index) => (
            <p key={index}>
              {token.symbol} ({token.name}) - {token.massaToken}
            </p>
          ))}
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.speed-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.speed-desc')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.what-token-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.what-token-desc', {
              amount: AIRDROP_AMOUNT,
            })}
          </p>
          <br />
          <p>{Intl.t('index.faq.mainnet.what-token-desc-1')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.zero-tx-fees-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.zero-tx-fees-desc')}</p>
          <br />
          <p>
            <p>
              {Intl.t('index.faq.mainnet.zero-tx-fees-desc-1')}

              <a
                target="_blank"
                href="https://docs.massa.net/docs/massaBridge/architecture-security"
              >
                <u> {Intl.t('index.faq.mainnet.massa-documentation')}</u>
              </a>
            </p>
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.storage-cost-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.storage-cost-desc')}

            <a
              target="_blank"
              href="https://docs.massa.net/docs/learn/storage-costs"
            >
              <u>{Intl.t('index.faq.mainnet.massa-documentation')}</u>
            </a>
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.service-fees-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.service-fees-desc')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.service-fees-desc-1')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.claim-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.claim-desc')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.wallets-title')}>
        <AccordionContent>
          <p>
            <a target="_blank" href="https://station.massa.net/">
              <u> {Intl.t('index.faq.mainnet.massa-wallet')}</u>
            </a>

            {Intl.t('index.faq.mainnet.wallets-desc-1')}
            {Intl.t('index.faq.mainnet.wallets-desc-2')}
            <a target="_blank" href="https://bearby.io/">
              {' '}
              <u>{Intl.t('index.faq.mainnet.bearby-wallet')}</u>
            </a>
            {Intl.t('index.faq.mainnet.wallets-desc-3')}
          </p>
        </AccordionContent>
      </Accordion>

      <div ref={addTokensToMassaRef}></div>
      <Accordion
        state={navigateToAddTokens}
        title={Intl.t('index.faq.mainnet.bridged-tokens-title')}
      >
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-subtitle-1')}</p>
          <br />
          <p>
            {Intl.t('index.faq.mainnet.bridged-tokens-subtitle-massa-desc')}
          </p>
          <br />
          <p>
            {Intl.t('index.faq.mainnet.bridged-tokens-subtitle-massa-desc-1')}
          </p>
          <br />
          <p>{Intl.t('index.faq.mainnet.how-to')}</p>
          <br />
          <div>
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-1')}
            <br /> <br />
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-2')}
            <br /> <br />
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-3')}
            <br /> <br />
            {tokens.map((token, index) => (
              <p key={index}>
                {token.symbol} ({token.name}) - {token.massaToken}
              </p>
            ))}
            <br />
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-4')}
          </div>
          <br /> <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-subtitle-2')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-desc-5')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-desc-6')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-desc-7')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-desc-8')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-desc-9')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-desc-10')}</p>
          <br />
          <p>{Intl.t('index.faq.mainnet.bridged-tokens-desc-11')}</p>
          <br />
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.sc-wallet-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.sc-wallet-desc')}</p>
        </AccordionContent>
      </Accordion>
      <Accordion title={Intl.t('index.faq.mainnet.no-wap-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.no-wap-desc')}{' '}
            <a target="_blank" href={bridgeUrl}>
              <u>{bridgeUrl}</u>
            </a>
            .
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.mobile-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.mobile-desc')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.feature-request-title')}>
        <AccordionContent>
          <p>
            {discordSupportChannel ? (
              <>
                {Intl.t('index.faq.mainnet.feature-request-desc-1')}{' '}
                <a target="_blank" href={discordSupportChannel}>
                  <u>Discord Support Channel</u>
                </a>
                {'.'}
              </>
            ) : (
              Intl.t('index.faq.mainnet.support-channel')
            )}
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.no-find-title')}>
        <AccordionContent>
          <p>
            {discordSupportChannel ? (
              <>
                {Intl.t('index.faq.mainnet.no-find-desc-1')}{' '}
                <a target="_blank" href={discordSupportChannel}>
                  <u>Discord Support Channel</u>
                </a>{' '}
                {Intl.t('index.faq.mainnet.no-find-desc-2')}{' '}
                {Intl.t('index.faq.mainnet.no-find-desc-3')}
              </>
            ) : (
              Intl.t('index.faq.mainnet.support-channel')
            )}
          </p>
        </AccordionContent>
      </Accordion>
    </div>
  );
}
