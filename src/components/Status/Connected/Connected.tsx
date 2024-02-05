import { Tag } from '@massalabs/react-ui-kit';

import Intl from '@/i18n/i18n';
import { tagTypes } from '@/utils/const';

export function Connected() {
  return <Tag type={tagTypes.success}>{Intl.t('index.tag.connected')}</Tag>;
}
