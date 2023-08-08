import {
  PopupModal,
  PopupModalContent,
  PopupModalHeader,
} from '@massalabs/react-ui-kit';

import { ConnectWalletCards } from '@/components';
import Intl from '@/i18n/i18n';

export function ConnectWalletPopup({ ...props }) {
  const { setOpen } = props;

  const args = {
    onOpen: () => {
      return null;
    },
    onClose: () => {
      setOpen(false);
    },
  };

  return (
    <PopupModal
      customClass="w-fit max-w-4xl"
      customClassNested="border border-tertiary bg-secondary/50 backdrop-blur-lg"
      fullMode={true}
      onOpen={args.onOpen}
      onClose={args.onClose}
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
        <ConnectWalletCards />
      </PopupModalContent>
    </PopupModal>
  );
}
