import { useEffect } from 'react';
import { PopupModal, PopupModalContent, Button } from '@massalabs/react-ui-kit';
import { useAccountStore } from '@/store/store';
import { _getFromStorage, _setInStorage } from '@/utils/storage';
import { acceptTos, areTosValid } from '@/utils/tos';

export function Tos() {
  const { tosAcceptance } = useAccountStore();
  useEffect(() => {
    areTosValid();
  }, []);
  return (
    <>
      {!tosAcceptance && (
        <PopupModal
          customClass="flex justify-center text-s-info"
          customClassNested="w-1/2 py-10"
          fullMode={true}
        >
          <PopupModalContent>
            <div className=" flex flex-col justify-center gap-4">
              <div className="mas-title">Accept the Terms of Service</div>
              <a href="https://bridge.massa.net/legal/ToS.pdf" target="_blank">
                <u>Terms of service</u>
              </a>
              <Button onClick={() => acceptTos()}>Accept</Button>
            </div>
          </PopupModalContent>
        </PopupModal>
      )}
    </>
  );
}
