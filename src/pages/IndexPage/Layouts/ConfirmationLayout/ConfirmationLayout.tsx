import { Button, formatAmount } from '@massalabs/react-ui-kit';
import { FiArrowRight, FiX } from 'react-icons/fi';
import { Hr } from '@/components/Hr';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/operationStore';
import { useTokenStore } from '@/store/tokenStore';

interface ConfirmationLayoutProps {
  prevPage: () => void;
}

export function ConfirmationLayout(props: ConfirmationLayoutProps) {
  const { prevPage } = props;
  const { isMassaToEvm, inputAmount, outputAmount } = useOperationStore();
  const { selectedToken } = useTokenStore();
  const massaToEvm = isMassaToEvm();

  if (!inputAmount || !outputAmount) return;

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center">
        <Button
          customClass="absolute"
          onClick={() => prevPage()}
          variant={'icon'}
        >
          <FiX />
        </Button>
        <div className="flex items-center w-full justify-center">
          {massaToEvm
            ? Intl.t('confirmation.redeem')
            : Intl.t('confirmation.bridge')}
        </div>
      </div>
      <div className="flex items-center gap-6 justify-center w-full">
        MASSA <FiArrowRight /> EVM
      </div>
      <Hr />
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>{Intl.t('confirmation.sending')}</div>
            <div>
              {formatAmount(inputAmount, selectedToken?.decimals).full}
              {selectedToken?.symbol}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>{Intl.t('confirmation.token-address')}</div>
            <div>{selectedToken?.evmToken}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center w-full justify-between">
          <div>Evm {Intl.t('confirmation.fees')}</div>
          <div>1000</div>
        </div>
        <div className="flex items-center w-full  justify-between">
          <div>Massa {Intl.t('confirmation.fees')}</div>
          <div>0</div>
        </div>
        <div className="flex items-center w-full  justify-between">
          <div>{Intl.t('confirmation.service-fee')}</div>
          <div>0.2</div>
        </div>
      </div>
      <div className="flex itmes-center w-full justify-between">
        <div>{Intl.t('index.input.placeholder.receive')}</div>
        <div>{formatAmount(outputAmount, selectedToken?.decimals).full}</div>
      </div>
      <div className="flex items-center w-full justify-between">
        <div>{Intl.t('confirmation.transfer-time')}</div>
        <div>{Intl.t('confirmation.minutes')}</div>
      </div>
    </div>
  );
}
