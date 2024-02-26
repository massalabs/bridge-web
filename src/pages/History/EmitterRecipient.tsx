import { MassaLogo } from '@massalabs/react-ui-kit';
import { sepolia } from 'wagmi/chains';
import { EthSvg } from '@/assets/EthSvg';
import { SepSvg } from '@/assets/SepSvg';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';

interface EmitterRecipientProps {
  isMassaToEvm: boolean;
  isOpOnMainnet: boolean;
}
export function EmitterRecipient(props: EmitterRecipientProps) {
  const { isMassaToEvm, isOpOnMainnet } = props;

  return (
    <div className="flex items-center gap-2">
      <div>
        {isMassaToEvm ? (
          <MassaLogo size={22} />
        ) : isOpOnMainnet ? (
          <EthSvg size={22} />
        ) : (
          <SepSvg size={22} />
        )}
      </div>
      <div>
        {isMassaToEvm
          ? `${Intl.t(`history.${Blockchain.MASSA}`)} ${
              isOpOnMainnet
                ? Intl.t(`history.mainnet`)
                : Intl.t(`history.buildnet`)
            }`
          : isOpOnMainnet
          ? `${Intl.t(`history.${Blockchain.ETHEREUM}`)} ${Intl.t(
              `history.mainnet`,
            )}`
          : Intl.t(`history.${sepolia.name}`)}
      </div>
    </div>
  );
}
