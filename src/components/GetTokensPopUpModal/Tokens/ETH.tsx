import Intl from '@/i18n/i18n';

import { GradientCard } from '@/components';
import { Tag } from '@massalabs/react-ui-kit';

export function ETH() {
  return (
    <GradientCard customClass="w-72 h-80">
      <Tag
        type="default"
        content={Intl.t(`get-tokens.tag.ETH`)}
        customClass="mb-4"
      />
      <p className="mas-menu-default text-center mb-4">
        {Intl.t(`get-tokens.card.ETH-description`)}
      </p>
      <p className="mas-menu-underline mb-4 cursor-pointer">
        {Intl.t(`get-tokens.card.link`)}
      </p>
    </GradientCard>
  );
}
