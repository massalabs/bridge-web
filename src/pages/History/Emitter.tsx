import { MassaLogo } from '@massalabs/react-ui-kit';
import { EthSvg } from '@/assets/EthSvg';

import { Blockchain } from '@/const';
import { SIDE } from '@/utils/const';

export function Emitter({ ...props }) {
  const { side } = props;

  return (
    <div className="flex items-center gap-2">
      <div>
        {side === SIDE.EVM_TO_MASSA ? (
          <EthSvg size={22} />
        ) : (
          <MassaLogo size={22} />
        )}
      </div>
      <div>
        {side === SIDE.EVM_TO_MASSA ? Blockchain.ETHEREUM : Blockchain.MASSA}
      </div>
    </div>
  );
}
