import { useEffect, useState } from 'react';

import { Tag, toast } from '@massalabs/react-ui-kit';

import { GradientCard, handleErrorMessage } from '@/components';
import { TDAI_CONTRACT_ADDRESS } from '@/const';
import { useMintToken } from '@/custom/bridge/useMintToken';
import Intl from '@/i18n/i18n';

export function TDAI() {
  const [selectedToken, setSelectedToken] = useState(TDAI_CONTRACT_ADDRESS);

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
      handleErrorMessage(error.message);
    }
  }, [prepareContractWrite.isError]);

  useEffect(() => {
    const { isError, error } = contractWrite;

    if (isError && error) {
      handleErrorMessage(error.message);
    }
  }, [contractWrite.isError]);

  return (
    <GradientCard customClass="w-72 h-80">
      <Tag type="warning" customClass="mb-4">
        {Intl.t('get-tokens.tag.tDAI')}
      </Tag>
      <p className="mas-menu-default text-center mb-4">
        {Intl.t('get-tokens.card.tDAI-description')}
      </p>
      {waitForTransaction.isLoading || contractWrite.isLoading ? (
        <p className="mas-menu-default mb-4">{Intl.t('get-tokens.minting')}</p>
      ) : (
        <p
          className="mas-menu-underline mb-4 cursor-pointer"
          onClick={() => {
            setSelectedToken(TDAI_CONTRACT_ADDRESS);
            contractWrite.write?.();
          }}
        >
          {Intl.t(`get-tokens.card.mint`, { token: 'tDAI' })}
        </p>
      )}
    </GradientCard>
  );
}
