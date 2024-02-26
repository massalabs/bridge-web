import { MassaLogo } from '@massalabs/react-ui-kit';
import { EthSvg } from '@/assets/EthSvg';

import { Blockchain } from '@/const';
import { SIDE } from '@/utils/const';

export function Recipient({ ...props }) {
  const { side } = props;

  return (
    <div className="flex items-center gap-2">
      <div>
        {side === SIDE.MASSA_TO_EVM ? (
          <EthSvg size={22} />
        ) : (
          <MassaLogo size={22} />
        )}
      </div>

      <div>
        {side === SIDE.MASSA_TO_EVM ? Blockchain.ETHEREUM : Blockchain.MASSA}
      </div>
    </div>
  );
}
