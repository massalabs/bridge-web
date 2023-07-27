import Intl from '@/i18n/i18n';
import { tagTypes } from '@/utils/const';

import { Tag } from '@massalabs/react-ui-kit';

export function NoAccounts() {
  return (
    <Tag type={tagTypes.error} content={Intl.t(`index.tag.no-accounts`)} />
  );
}
