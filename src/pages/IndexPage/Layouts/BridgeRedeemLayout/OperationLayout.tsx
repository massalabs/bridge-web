import { useState } from 'react';
import { formatAmount, Button } from '@massalabs/react-ui-kit';
import { FiRepeat } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { boxLayout, FeesEstimation, WarningNoEth } from '.';
import { GetTokensPopUpModal } from '@/components';
import { ServiceFeeTooltip } from '@/components/ServiceFeeTooltip/ServiceFeeTooltip';
import { useServiceFee } from '@/custom/bridge/useServiceFee';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/operationStore';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import { SIDE } from '@/utils/const';
import { serviceFeeToPercent } from '@/utils/utils';

export function OperationLayout() {
  const { isConnected: isEvmWalletConnected } = useAccount();
  const { isMainnet } = useBridgeModeStore();

  const { isMassaToEvm, inputAmount, setSide, setAmounts, serviceFeeAmount } =
    useOperationStore();

  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);

  const { isFetching } = useAccountStore();

  const { selectedToken: token } = useTokenStore();
  const { serviceFee } = useServiceFee();

  function handleToggleLayout() {
    setAmounts();

    setSide(isMassaToEvm() ? SIDE.EVM_TO_MASSA : SIDE.MASSA_TO_EVM);
  }

  return (
    <>
      <div className="p-6 bg-primary rounded-2xl">
        <p className="mb-2 mas-body">{Intl.t('index.from')}</p>
        {boxLayout().up.header}
        {boxLayout().up.input}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isMainnet() && isEvmWalletConnected && (
              <h3
                className="mas-h3 text-f-disabled-1 underline cursor-pointer"
                onClick={() => setOpenTokensModal(true)}
              >
                {Intl.t('index.get-tokens')}
              </h3>
            )}
          </div>
        </div>
      </div>
      <div className=" flex justify-center items-center">
        <Button
          disabled={isFetching}
          variant="toggle"
          onClick={handleToggleLayout}
          customClass={`w-12 h-12 inline-block transition ease-in-out delay-10 ${
            isMassaToEvm() ? 'rotate-180' : ''
          }`}
        >
          <FiRepeat size={24} />
        </Button>
      </div>
      <div className="p-6 bg-primary rounded-2xl">
        {isMassaToEvm() ? (
          <div className="flex items-center mb-4 gap-2">
            <p className="mas-body">
              {Intl.t('index.input.placeholder.receive')}
            </p>
            <ServiceFeeTooltip
              inputAmount={
                formatAmount(inputAmount || '0', token?.decimals).full
              }
              serviceFeePercent={serviceFeeToPercent(serviceFee)}
              serviceFeeAmount={
                formatAmount(serviceFeeAmount || 0n, token?.decimals).full
              }
              symbol={token?.symbol || ''}
            />
          </div>
        ) : (
          <p className="mb-2 mas-body">{Intl.t('index.to')}</p>
        )}
        {boxLayout().down.header}
        {boxLayout().down.input}
        <WarningNoEth />
      </div>

      <FeesEstimation />

      {openTokensModal && (
        <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
      )}
    </>
  );
}
