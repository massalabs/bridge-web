import { useEffect } from 'react';
import { PopupModal, PopupModalContent, Button } from '@massalabs/react-ui-kit';
import { acceptTos, areTosValid } from '@/custom/bridge/tos';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { _getFromStorage, _setInStorage } from '@/utils/storage';

export function Tos() {
  const { tosAcceptance } = useAccountStore();
  useEffect(() => {
    areTosValid();
  }, [areTosValid]);
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
              <div className="mas-title">
                {Intl.t('terms-of-service.title')}
              </div>
              <a href="https://bridge.massa.net/legal/ToS.pdf" target="_blank">
                <u>{Intl.t('terms-of-service.description')}</u>
              </a>
              <Button onClick={() => acceptTos()}>
                {Intl.t('terms-of-service.cta')}
              </Button>
            </div>
          </PopupModalContent>
        </PopupModal>
      )}
    </>
  );
}
