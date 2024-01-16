import { Tag } from '@massalabs/react-ui-kit';

import Intl from '@/i18n/i18n';
import { tagTypes } from '@/utils/const';

export function NoWallet() {
  return (
    <Tag
      type={tagTypes.error}
      content={Intl.t(`connect-wallet.card-destination.tag.no-wallets`)}
    />
  );
}
