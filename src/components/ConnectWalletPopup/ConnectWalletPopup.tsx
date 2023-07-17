import {
  PopupModal,
  PopupModalContent,
  PopupModalHeader,
} from '@massalabs/react-ui-kit';
import { ConnectWalletCards } from './ConnectWalletCards';

export function ConnectWalletPopup({ ...props }) {
  const { setOpen } = props;
  const args = {
    onOpen: () => {
      console.log('event on open');
    },
    onClose: () => {
      setOpen(false);
    },
  };

  return (
    <>
      <PopupModal
        customClass="w-[720px] min-w-fit"
        fullMode={true}
        onOpen={args.onOpen}
        onClose={args.onClose}
      >
        <PopupModalHeader>
          <div className="text-f-primary flex flex-col mb-4">
            <label className="mas-title mb-4">Connect wallets</label>
            <div className="mas-body">
              Connect 1 wallet on Sepolia testnet and 1 on Massa Buildnet, to
              bridge tokens between networks.
            </div>
          </div>
        </PopupModalHeader>
        <PopupModalContent>
          <ConnectWalletCards />
        </PopupModalContent>
      </PopupModal>
    </>
  );
}
