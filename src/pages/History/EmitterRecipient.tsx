import { MassaLogo } from '@massalabs/react-ui-kit';
import { sepolia } from 'wagmi/chains';
import { EthSvg } from '@/assets/EthSvg';
import { SepoliaSvg } from '@/assets/SepoliaSVG';
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
          <SepoliaSvg size={22} />
        )}
      </div>
      <div>
        {isMassaToEvm
          ? `${Intl.t(`general.${Blockchain.MASSA}`)} ${
              isOpOnMainnet
                ? Intl.t(`general.Mainnet`)
                : Intl.t(`general.Buildnet`)
            }`
          : isOpOnMainnet
          ? `${Intl.t(`general.${Blockchain.ETHEREUM}`)} ${Intl.t(
              `general.Mainnet`,
            )}`
          : `${Intl.t(`general.${sepolia.name}`)} ${Intl.t(`general.Testnet`)}`}
      </div>
    </div>
  );
}
