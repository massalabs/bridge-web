import { MassaLogo } from '@massalabs/react-ui-kit';
import { EthSvg } from '@/assets/EthSvg';
import { isEvmToMassa } from '@/utils/lambdaApi';

export function RecipientEmitter({ ...props }) {
  const { address } = props;
  if (!address) return null;

  return (
    <div className="flex items-center gap-2">
      <div>
        {isEvmToMassa(address) ? <EthSvg size={22} /> : <MassaLogo size={22} />}
      </div>
      {/* TODO: translations */}
      <div>{isEvmToMassa(address) ? 'Ethereum' : 'Massa'}</div>
    </div>
  );
}
