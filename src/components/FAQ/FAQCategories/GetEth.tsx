import { FAQCategory, FAQContent } from '@massalabs/react-ui-kit';

import Intl from '@/i18n/i18n';
export function GetEth() {
  return (
    <FAQCategory
      categoryTitle={Intl.t('index.faq.get-tokens.get-eth.category-title')}
    >
      <FAQContent>
        <div>
          {Intl.t('index.faq.get-tokens.get-eth.category-content-one')}

          <a className="underline" href="https://sepoliafaucet.com/">
            {Intl.t('index.faq.get-tokens.get-eth.link-one')}
          </a>

          {Intl.t('index.faq.get-tokens.get-eth.category-content-two')}

          <a
            className="underline"
            href="https://www.web3.university/article/sepolia-eth"
          >
            {Intl.t('index.faq.get-tokens.get-eth.link-two')}
          </a>
        </div>
      </FAQContent>
    </FAQCategory>
  );
}
