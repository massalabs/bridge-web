import { MassaLogo } from '@massalabs/react-ui-kit';
import { sepolia } from 'wagmi/chains';
import { EthSvg } from '@/assets/EthSvg';
import { SepoliaSvg } from '@/assets/SepoliaSVG';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

interface EmitterOrRecipientProps {
  isMassaToEvm: boolean;
}
export function EmitterOrRecipient(props: EmitterOrRecipientProps) {
  const { isMassaToEvm } = props;
  const { isMainnet } = useBridgeModeStore();

  const isOpOnMainnet = isMainnet();
  const massaNetworkExtension = isOpOnMainnet
    ? Intl.t('general.Mainnet')
    : Intl.t('general.Buildnet');

  const evmChain = isOpOnMainnet ? Blockchain.ETHEREUM : sepolia.name;

  const evmChainNetwork = isOpOnMainnet
    ? Intl.t('general.Mainnet')
    : Intl.t('general.Testnet');

  return (
    <div className="flex items-center gap-2">
      <div>
        <ChainLogo isMassaToEvm={isMassaToEvm} isOpOnMainnet={isOpOnMainnet} />
      </div>
      <div>
        {(() => {
          if (isMassaToEvm) {
            return `${Intl.t(
              `general.${Blockchain.MASSA}`,
            )} ${massaNetworkExtension}`;
          }
          return `${Intl.t(`general.${evmChain}`)} ${Intl.t(
            `general.${evmChainNetwork}`,
          )}`;
        })()}
      </div>
    </div>
  );
}

interface ChainLogoProps {
  isMassaToEvm: boolean;
  isOpOnMainnet: boolean;
}

export function ChainLogo(props: ChainLogoProps) {
  const { isMassaToEvm, isOpOnMainnet } = props;
  if (isMassaToEvm) {
    return <MassaLogo size={22} />;
  }

  if (isOpOnMainnet) {
    return <EthSvg size={22} />;
  }

  return <SepoliaSvg size={22} />;
}
