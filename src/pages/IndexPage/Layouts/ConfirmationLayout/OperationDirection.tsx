import { BUILDNET, MAINNET } from '@massalabs/massa-web3';
import { FiArrowRight } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { BridgeMode } from '@/const';
import { getEvmNetworkIcon } from '@/custom/useGetEvmIconsAndName';
import Intl from '@/i18n/i18n';
import { massaIconsNetworks } from '@/pages';
import { useOperationStore } from '@/store/operationStore';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';

export function OperationDirection() {
  const { isMassaToEvm } = useOperationStore();
  const massaToEvm = isMassaToEvm();
  const { address, chain } = useAccount();
  const { connectedAccount } = useAccountStore();
  const { currentMode } = useBridgeModeStore();

  const massaIcon =
    currentMode === BridgeMode.mainnet
      ? massaIconsNetworks[MAINNET]
      : massaIconsNetworks[BUILDNET];

  const sender = massaToEvm ? Intl.t('general.Massa') : chain?.name;

  const senderAddress = massaToEvm
    ? connectedAccount?.name()
    : maskAddress(address || '', 4);

  const senderIcon = massaToEvm
    ? massaIcon
    : getEvmNetworkIcon(chain?.id || 0, 32);

  const receiver = massaToEvm ? chain?.name : Intl.t('general.Massa');

  const receiverAddress = massaToEvm
    ? maskAddress(address || '', 4)
    : connectedAccount?.name();

  const receiverIcon = massaToEvm
    ? getEvmNetworkIcon(chain?.id || 0, 32)
    : massaIcon;

  return (
    <div className="flex items-center ">
      <div className="flex items-center gap-4 w-fit">
        <div>{senderIcon} </div>
        <div className="flex flex-col">
          <div className="mas-menu-default">{sender}</div>
          <div className="mas-caption">{senderAddress}</div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full ">
        <div className="p-1 bg-neutral text-secondary rounded-full">
          <FiArrowRight size={24} />
        </div>
      </div>

      <div className="flex items-center gap-4 w-fit">
        <div>{receiverIcon}</div>
        <div className="flex flex-col">
          <div className="mas-menu-default">{receiver}</div>
          <div className="mas-caption">{receiverAddress}</div>
        </div>
      </div>
    </div>
  );
}
