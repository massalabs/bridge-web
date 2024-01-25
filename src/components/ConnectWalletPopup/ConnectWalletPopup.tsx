import {
  PopupModal,
  PopupModalContent,
  PopupModalHeader,
} from '@massalabs/react-ui-kit';
import { useAccount as useEvmAccount } from 'wagmi';

import { ConnectWallets } from './ConnectWallets';
import { Blockchain, BridgeMode, SUPPORTED_MASSA_WALLETS } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function useShowResourceSidePanel() {
  const { isConnected: isEvmWalletConnected } = useEvmAccount();
  const [providerList] = useAccountStore((state) => [state.providers]);

  const showSepoliaInstruction = !isEvmWalletConnected;
  const showStationDownload = !providerList.find(
    (provider) => provider.name() === SUPPORTED_MASSA_WALLETS.MASSASTATION,
  );

  const { currentMode } = useBridgeModeStore();

  const showResourceSidePanel =
    currentMode === BridgeMode.testnet &&
    (showSepoliaInstruction || showStationDownload);

  return { showResourceSidePanel, showSepoliaInstruction, showStationDownload };
}

interface ConnectWalletPopupProps {
  setOpen: (open: boolean) => void;
}
export function ConnectWalletPopup(props: ConnectWalletPopupProps) {
  const { setOpen } = props;

  const { showResourceSidePanel } = useShowResourceSidePanel();

  const networks = {
    network1: Blockchain.ETHEREUM,
    network2: Blockchain.MASSA,
  };

  return (
    <PopupModal
      customClass={`${
        showResourceSidePanel
          ? 'w-10/12 max-w-[900px]'
          : 'w-1/3 min-w-[470px] max-w-[700px]'
      }`}
      customClassNested="border border-tertiary bg-secondary/50 backdrop-blur-lg"
      fullMode={true}
      onClose={() => setOpen(false)}
    >
      <PopupModalHeader>
        <div className="text-f-primary flex flex-col mb-4">
          <label className="mas-title mb-4">
            {Intl.t('connect-wallet.title')}
          </label>
          <div className="mas-body">
            {Intl.t('connect-wallet.description', networks)}
          </div>
        </div>
      </PopupModalHeader>
      <PopupModalContent>
        <ConnectWallets />
      </PopupModalContent>
    </PopupModal>
  );
}
