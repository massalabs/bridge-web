import { useEffect, useState } from 'react';
import { Tag, toast } from '@massalabs/react-ui-kit';
import { type BaseError } from 'wagmi';
import { GradientCard, handleErrorMessage } from '@/components';
import { WETH_CONTRACT_ADDRESS } from '@/const';
import { useMintToken } from '@/custom/bridge/useMintToken';
import Intl from '@/i18n/i18n';

export function WETH() {
  const [selectedToken, setSelectedToken] = useState(WETH_CONTRACT_ADDRESS);

  const { write, isLoading, isSuccess, error } = useMintToken({
    tokenAddress: selectedToken,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(Intl.t('get-tokens.success'));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      handleErrorMessage((error as BaseError).shortMessage || error.message);
    }
  }, [error]);

  return (
    <GradientCard customClass="w-72 h-80">
      <Tag type="default" customClass="mb-4">
        {Intl.t('get-tokens.tag.WETH')}
      </Tag>
      <p className="mas-menu-default text-center mb-4">
        {Intl.t('get-tokens.card.WETH-description')}
      </p>
      {isLoading ? (
        <p className="mas-menu-default mb-4">{Intl.t('get-tokens.minting')}</p>
      ) : (
        <p
          className="mas-menu-underline mb-4 cursor-pointer"
          onClick={() => {
            setSelectedToken(WETH_CONTRACT_ADDRESS);
            write();
          }}
        >
          {Intl.t('get-tokens.card.mint', { token: 'WETH' })}
        </p>
      )}
    </GradientCard>
  );
}
