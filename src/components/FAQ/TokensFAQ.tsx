import { FAQ } from '@massalabs/react-ui-kit';

import { AddTokensFAQ, GetEthFAQ } from './FAQCategories';
import Intl from '@/i18n/i18n';

export function TokensFAQ() {
  return (
    <div className="w-1/2 flex flex-col gap-5 items-center">
      <div>
        <p className="mas-title text-neutral">FAQ</p>
      </div>
      <FAQ state={true} title={Intl.t('index.faq.get-tokens.title')}>
        <GetEthFAQ />
      </FAQ>

      <FAQ title={Intl.t('index.faq.add-tokens.title')}>
        <AddTokensFAQ />
      </FAQ>
    </div>
  );
}
