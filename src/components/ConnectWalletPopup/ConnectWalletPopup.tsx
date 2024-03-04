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
  const {
    massaNetwork: getMassaNetwork,
    evmNetwork: getEvmNetwork,
    isMainnet: getIsMainnet,
  } = useBridgeModeStore();
  const { chain } = useAccount();

  const evmNetwork = getEvmNetwork();
  const massaNetwork = getMassaNetwork();
  const isMainnet = getIsMainnet();
  const chainName = chain ? chain.name : Blockchain.UNKNOWN;
  const currentEvmChain = isMainnet
    ? Intl.t(`general.${Blockchain.ETHEREUM}`)
    : chainName;
  const networks = {
    network1: `${currentEvmChain} ${Intl.t(`general.${evmNetwork}`)}`,
    network2: `${Intl.t(`general.${Blockchain.MASSA}`)} ${Intl.t(
      `general.${massaNetwork}`,
    )}`,
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
