import Intl from '@/i18n/i18n';
import { tagTypes } from '@/utils/const';

import { Tag } from '@massalabs/react-ui-kit';

export function Connected() {
  return (
    <Tag type={tagTypes.success} content={Intl.t(`index.tag.connected`)} />
  );
}