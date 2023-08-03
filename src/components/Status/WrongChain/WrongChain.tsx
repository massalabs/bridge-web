import { Tag } from '@massalabs/react-ui-kit';

import Intl from '@/i18n/i18n';
import { tagTypes } from '@/utils/const';

export function WrongChain() {
  return (
    <Tag type={tagTypes.warning} content={Intl.t(`index.tag.wrong-chain`)} />
  );
}
