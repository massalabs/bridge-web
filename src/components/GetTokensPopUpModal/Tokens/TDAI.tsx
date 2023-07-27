import { useEffect, useState } from 'react';
import Intl from '@/i18n/i18n';
import { useMintToken } from '@/custom/bridge/useMintToken';

import { GradientCard } from '@/components';
import { TDAI_CONTRACT_ADDRESS } from '@/const';
import { ErrorsMap } from '@/components';
import { Tag, toast } from '@massalabs/react-ui-kit';

export function TDAI() {
  const [selectedToken, setSelectedToken] = useState(TDAI_CONTRACT_ADDRESS);

  const { contractWrite, waitForTransaction, prepareContractWrite } =
    useMintToken({ tokenAddress: selectedToken });

  useEffect(() => {
    const { isSuccess } = waitForTransaction;

    if (isSuccess) {
      toast.success(`Successfully minted`);
    }
  }, [waitForTransaction.isSuccess]);

  useEffect(() => {
    const { isError, error } = prepareContractWrite;

    if (isError && error) {
      toast.error(`Error: ${ErrorsMap[error.name] || ErrorsMap.Failed}`);
    }
  }, [prepareContractWrite.isError]);

  useEffect(() => {
    const { isError, error } = contractWrite;

    if (isError && error) {
      toast.error(`Error: ${ErrorsMap[error.name] || ErrorsMap.Failed}`);
    }
  }, [contractWrite.isError]);

  return (
    <GradientCard customClass="w-72 h-80">
      <Tag
        type="warning"
        content={Intl.t(`get-tokens.tag.tDAI`)}
        customClass="mb-4"
      />
      <p className="mas-menu-default text-center mb-4">
        {Intl.t(`get-tokens.card.tDAI-description`)}
      </p>
      {waitForTransaction.isLoading || contractWrite.isLoading ? (
        <p className="mas-menu-default mb-4">Minting...</p>
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
      <p className="mas-menu-underline mb-4 cursor-pointer">
        {Intl.t(`get-tokens.card.link`)}
      </p>
    </GradientCard>
  );
}
