import { Link } from 'react-router-dom';

import { LoadingBoxProps } from './LoadingLayout';
import { MASSA, METAMASK } from '@/const';
import { faqURL } from '@/const/faq';
import Intl from '@/i18n/i18n';
import { useTokenStore } from '@/store/store';

export function SuccessLayout(props: LoadingBoxProps) {
  const { massaToEvm, amount, onClose } = props;

  const [token] = useTokenStore((state) => [state.token]);

  const massa = Intl.t('general.massa');
  const sepolia = Intl.t('general.sepolia');

  return (
    <div className="mas-body2 text-center">
      <div className="mb-1">
        {massaToEvm
          ? Intl.t('index.loading-box.redeemed')
          : Intl.t('index.loading-box.bridged')}
        <div className="mas-subtitle p-2">
          {amount} {token?.symbol}
        </div>
        {Intl.t('index.loading-box.from-to', {
          from: massaToEvm ? massa : sepolia,
          to: massaToEvm ? sepolia : massa,
        })}
      </div>
      <p className="mb-1">
        {Intl.t('index.loading-box.check', {
          name: massaToEvm ? METAMASK : MASSA,
        })}
      </p>

      <div className="mb-1">
        {Intl.t('index.loading-box.add-tokens-message')}
      </div>
      <u>
        <Link
          onClick={onClose}
          to={{
            search: massaToEvm
              ? faqURL.addTokens.addToMetamask
              : faqURL.addTokens.addToMassa,
          }}
          className="underline"
        >
          {Intl.t('unexpected-error.link')}
        </Link>
      </u>
    </div>
  );
}
