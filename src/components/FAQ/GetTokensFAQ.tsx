import { FAQ } from '@massalabs/react-ui-kit';

import { GetEth } from './FAQCategories/GetEth';
import Intl from '@/i18n/i18n';

export function GetTokensFAQ() {
  return (
    <div className=" w-1/2">
      <div>
        <hr />
        <p>FAQ</p>
        <hr />
      </div>
      <p>
        <FAQ title={Intl.t('index.faq.get-tokens.get-eth.title')}>
          <GetEth />
        </FAQ>
      </p>
    </div>
  );
}
