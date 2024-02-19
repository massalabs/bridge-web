import {
  PopupModal,
  PopupModalContent,
  PopupModalHeader,
} from '@massalabs/react-ui-kit';

import { useAccount } from 'wagmi';
import { ConnectWallets } from './ConnectWallets';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

interface ConnectWalletPopupProps {
  setOpen: (open: boolean) => void;
}
export function ConnectWalletPopup(props: ConnectWalletPopupProps) {
  const { setOpen } = props;
  const { massaNetwork, evmNetwork } = useBridgeModeStore();
  const { chain } = useAccount();

  // Depending on mode and side

  const networks = {
    network1: `${chain ? chain.name : Blockchain.ETHEREUM} ${evmNetwork}`,
    network2: `${Blockchain.MASSA} ${massaNetwork}`,
  };

  return (
    <PopupModal
      customClass="w-1/3 min-w-[470px] max-w-[700px]"
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
