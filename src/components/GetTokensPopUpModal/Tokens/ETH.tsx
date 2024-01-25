import { Tag } from '@massalabs/react-ui-kit';

import { GradientCard } from '@/components';
import Intl from '@/i18n/i18n';
import { SEPOLIA_FAUCET_LINK } from '@/utils/const';

export function ETH() {
  return (
    <GradientCard customClass="w-72 h-80">
      <Tag type="default" customClass="mb-4">
        {Intl.t('get-tokens.tag.ETH')}
      </Tag>
      <p className="mas-menu-default text-center mb-4">
        {Intl.t(`get-tokens.card.ETH-description`)}
      </p>
      <a
        href={SEPOLIA_FAUCET_LINK}
        target="_blank"
        className="mas-menu-underline mb-4 cursor-pointer"
      >
        {Intl.t(`get-tokens.card.link`)}
      </a>
    </GradientCard>
  );
}
