import { useEffect, useState } from 'react';

import { Tag, toast } from '@massalabs/react-ui-kit';

import { GradientCard, ErrorsMap } from '@/components';
import { WETH_CONTRACT_ADDRESS } from '@/const';
import { useMintToken } from '@/custom/bridge/useMintToken';
import Intl from '@/i18n/i18n';

export function WETH() {
  const [selectedToken, setSelectedToken] = useState(WETH_CONTRACT_ADDRESS);

  const { contractWrite, waitForTransaction, prepareContractWrite } =
    useMintToken({ tokenAddress: selectedToken });

  useEffect(() => {
    const { isSuccess } = waitForTransaction;

    if (isSuccess) {
      toast.success(Intl.t('get-tokens.success'));
    }
  }, [waitForTransaction.isSuccess]);

  useEffect(() => {
    const { isError, error } = prepareContractWrite;

    if (isError && error) {
      toast.error(`${ErrorsMap[error.name] || ErrorsMap.General}`);
    }
  }, [prepareContractWrite.isError]);

  useEffect(() => {
    const { isError, error } = contractWrite;

    if (isError && error) {
      toast.error(`${ErrorsMap[error.name] || ErrorsMap.General}`);
    }
  }, [contractWrite.isError]);

  return (
    <GradientCard customClass="w-72 h-80">
      <Tag
        type="default"
        content={Intl.t('get-tokens.tag.WETH')}
        customClass="mb-4"
      />
      <p className="mas-menu-default text-center mb-4">
        {Intl.t(`get-tokens.card.WETH-description`)}
      </p>
      {waitForTransaction.isLoading || contractWrite.isLoading ? (
        <p className="mas-menu-default mb-4">{Intl.t('get-tokens.minting')}</p>
      ) : (
        <p
          className="mas-menu-underline mb-4 cursor-pointer"
          onClick={() => {
            setSelectedToken(WETH_CONTRACT_ADDRESS);
            contractWrite.write?.();
          }}
        >
          {Intl.t(`get-tokens.card.mint`, { token: 'WETH' })}
        </p>
      )}
    </GradientCard>
  );
}
