import { useRef, useEffect } from 'react';
import { Accordion, AccordionContent } from '@massalabs/react-ui-kit';
import {
  FAQsections,
  bridgeEmail,
  bridgeTutorialLink,
  bridgeUrl,
  discordSupportChannel,
} from '@/const/faq';
import { useQuery } from '@/custom/api/useQuery';
import Intl from '@/i18n/i18n';
import { useTokenStore } from '@/store/tokenStore';

export function MainnetFAQ() {
  const query = useQuery();
  const { tokens } = useTokenStore();

  const addTokensToMassa = useRef<HTMLDivElement | null>(null);

  const sectionToNavigate: string | null = query.get('section');

  useEffect(() => {
    if (sectionToNavigate) {
      scrollToFAQ();
    }
  }, [sectionToNavigate]);

  function scrollToFAQ() {
    if (addTokensToMassa.current) {
      addTokensToMassa.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const showAddTokens = sectionToNavigate === FAQsections.addTokens;

  return (
    <div className="w-1/2 flex flex-col gap-5 items-center">
      <div>
        <p className="mas-title text-neutral">{Intl.t('navbar.faq')}</p>
      </div>
      <Accordion title={Intl.t('index.faq.mainnet.airdrop-title')}>
        <AccordionContent>
          <p>{Intl.t('index.faq.mainnet.airdrop-desc')}</p>
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
            <a href="mailto:support.bridge@massa.net">{bridgeEmail}</a>.
            <br /> <br />
            {Intl.t('index.faq.mainnet.not-visible-desc-2')}
            <a href="mailto:support.bridge@massa.net">{bridgeEmail}</a>.
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.exceed-title')}>
        <AccordionContent>
          <p>
            {Intl.t('index.faq.mainnet.exceed-desc')}
            <a href="mailto:support.bridge@massa.net">{bridgeEmail}</a>.
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
              <a href={`${bridgeTutorialLink}`}>
                {Intl.t('index.faq.mainnet.tutorial-desc')}
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
            {Intl.t('index.faq.mainnet.what-token-desc')}
            <a href="https://docs.massa.net/docs/learn/storage-costs">
              {Intl.t('index.faq.mainnet.massa-documentation')}
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
              {Intl.t('index.faq.mainnet.massa-documentation')}
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
              {' '}
              {Intl.t('index.faq.mainnet.massa-wallet')}
            </a>{' '}
            {Intl.t('index.faq.mainnet.wallets-desc-1')}
            {Intl.t('index.faq.mainnet.wallets-desc-2')}
            <a href="https://bearby.io/">
              {Intl.t('index.faq.mainnet.bearby-wallet')}
            </a>
            {Intl.t('index.faq.mainnet.wallets-desc-3')}
          </p>
        </AccordionContent>
      </Accordion>

      <div ref={addTokensToMassa}></div>
      <Accordion
        state={showAddTokens}
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
            {Intl.t('index.faq.mainnet.no-wap-desc')}
            <a href="bridge.massa.net/index">{bridgeUrl}</a>.
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
            {discordSupportChannel
              ? `${Intl.t('index.faq.mainnet.feature-request-title')} ${(
                  <a href={discordSupportChannel}>{discordSupportChannel}</a>
                )}`
              : Intl.t('index.faq.mainnet.support-channel')}
          </p>
        </AccordionContent>
      </Accordion>

      <Accordion title={Intl.t('index.faq.mainnet.no-find-title')}>
        <AccordionContent>
          <p>
            {discordSupportChannel
              ? `${Intl.t('index.faq.mainnet.no-find-desc-1')} ${(
                  <a href={discordSupportChannel}>{discordSupportChannel}</a>
                )} ${Intl.t('index.faq.mainnet.no-find-desc-2')}`
              : Intl.t('index.faq.mainnet.support-channel')}
          </p>
        </AccordionContent>
      </Accordion>
    </div>
  );
}
