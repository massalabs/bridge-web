import { useRef, useEffect } from 'react';
import { Accordion, AccordionContent } from '@massalabs/react-ui-kit';
import {
  FAQsections,
  bridgeEmail,
  bridgeTutorialLink,
  bridgeUrl,
  bridgeWmasPageLink,
  discordSupportChannel,
  historyPageLink,
} from '@/const/faq';
import { useQuery } from '@/custom/api/useQuery';
import Intl from '@/i18n/i18n';
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
                DAO Maker
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
                Massa Wallet FAQ
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
            7. You will need to sign 2 transactions on BSC with your MetaMask
            wallet, firstly to increase allowance and one to initiate the
            transfer.
          </p>
          <p>
            8. Wait for the transfer to be completed, it can take a couple of
            minutes.
          </p>
          <br />
          <p>
            If you have any doubts on your transaction you can go to the{' '}
            <u>
              <a href={historyPageLink} target="_blank">
                History page
              </a>
            </u>
            {''} {''}to verify your transaction's status.
          </p>
          <br />
          {discordSupportChannel && (
            <p>
              If you encounter any technical problems during your bridge drop us
              a message at our
              <a href={discordSupportChannel}>Discord Support Channel</a>
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
            <a href="mailto:support.bridge@massa.net">
              <u> {bridgeEmail} </u>
            </a>
            .
            <br /> <br />
            {Intl.t('index.faq.mainnet.not-visible-desc-2')}
            <a href="mailto:support.bridge@massa.net">
              <u>{bridgeEmail}</u>
            </a>
            .
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.exceed-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.exceed-desc')}
            <a href="mailto:support.bridge@massa.net">
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
            {bridgeTutorialLink ? (
              <a href={bridgeTutorialLink}>
                <u>{Intl.t('index.faq.mainnet.tutorial-desc')}</u>
              </a>
            ) : (
              Intl.t('index.faq.mainnet.tutorial-empty-desc')
            )}
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.suffix-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.suffix-desc')}</p>
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

            <a href="https://docs.massa.net/docs/learn/storage-costs">
              <u> {Intl.t('index.faq.mainnet.massa-documentation')}</u>
            </a>
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.zero-tx-fees-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.zero-tx-fees-desc')}</p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.storage-cost-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.storage-cost-desc')}

            <a href="https://docs.massa.net/docs/learn/storage-costs">
              <u>{Intl.t('index.faq.mainnet.massa-documentation')}</u>
            </a>
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.service-fees-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.service-fees-desc')}</p>
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
            <a href="https://station.massa.net/">
              <u> {Intl.t('index.faq.mainnet.massa-wallet')}</u>
            </a>

            {Intl.t('index.faq.mainnet.wallets-desc-1')}
            {Intl.t('index.faq.mainnet.wallets-desc-2')}
            <a href="https://bearby.io/">
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
          <p>
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-1')}
            <br /> <br />
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-2')}
            <br /> <br />
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-3')}
            <br /> <br />
            {tokens.map((token, index) => (
              <p key={index}>
                {token.symbol} - {token.massaToken}
              </p>
            ))}
            <br /> <br />
            {Intl.t('index.faq.mainnet.bridged-tokens-desc-4')}
          </p>
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
            <a href="bridge.massa.net/index">
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
                {Intl.t('index.faq.mainnet.no-find-desc-1')}
                <a href={discordSupportChannel}>
                  <u>{discordSupportChannel} </u>
                </a>
                {Intl.t('index.faq.mainnet.no-find-desc-2')}
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
                <a href={discordSupportChannel}>
                  <u>{discordSupportChannel}</u>
                </a>
                {Intl.t('index.faq.mainnet.no-find-desc-2')}
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
