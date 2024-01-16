import {
  PopupModal,
  PopupModalContent,
  PopupModalHeader,
} from '@massalabs/react-ui-kit';

import { ConnectWallets } from './ConnectWallets';
import Intl from '@/i18n/i18n';

interface ConnectWalletPopupProps {
  setOpen: (open: boolean) => void;
}
export function ConnectWalletPopup(props: ConnectWalletPopupProps) {
  const { setOpen } = props;
  return (
    <PopupModal
      customClass="w-fit max-w-4xl"
      customClassNested="border border-tertiary bg-secondary/50 backdrop-blur-lg"
      fullMode={true}
      onClose={() => setOpen(false)}
    >
      <PopupModalHeader>
        <div className="text-f-primary flex flex-col mb-4">
          <label className="mas-title mb-4">
            {Intl.t('connect-wallet.title')}
          </label>
          <div className="mas-body">{Intl.t('connect-wallet.description')}</div>
        </div>
      </PopupModalHeader>
      <PopupModalContent>
        <ConnectWallets />
      </PopupModalContent>
    </PopupModal>
  );
}
