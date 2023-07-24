import Intl from '@/i18n/i18n';
import { maskAddress } from '@/utils/massaFormat';
import { SelectMassaWalletAccount } from '@/components';
import { IAccount, IAccountBalanceResponse } from '@massalabs/wallet-provider';
import { useEffect, useState } from 'react';
import { Clipboard } from '@massalabs/react-ui-kit';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { BsDiamondHalf } from 'react-icons/bs';
import {
  Dropdown,
  MassaLogo,
  MassaToken,
  Tag,
  Currency,
  Button,
  toast,
} from '@massalabs/react-ui-kit';

const iconsNetworks = {
  Sepolia: <BsDiamondHalf size={40} />,
  OTHER: <BsDiamondHalf />,
};

export function ConnectedCardEVM({ ...props }) {
  const { account } = props;

  const { chains } = useNetwork();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 w-full h-full">
        <Dropdown
          options={chains.map((chain) => ({
            item: chain.name,
            icon: iconsNetworks['Sepolia'],
          }))}
        />
        <Clipboard
          displayedContent={maskAddress(account?.address().toString())}
          rawContent={maskAddress(account?.address().toString())}
          toggleHover={false}
          customClass="h-14"
        />
      </div>
      <div>
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
        {/* {Number(balance?.candidateBalance || 0)} MAS */}
      </div>
    </div>
  );
}
