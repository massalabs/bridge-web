import { Tag } from '@massalabs/react-ui-kit';

import Intl from '@/i18n/i18n';
import { tagTypes } from '@/utils/const';

export function NoAccounts() {
  return <Tag type={tagTypes.error}>{Intl.t('index.tag.no-accounts')}</Tag>;
}
