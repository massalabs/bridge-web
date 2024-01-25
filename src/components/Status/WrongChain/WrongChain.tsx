import { Tag, Tooltip } from '@massalabs/react-ui-kit';

import { FiHelpCircle } from 'react-icons/fi';
import { Blockchain, SUPPORTED_MASSA_WALLETS } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { tagTypes } from '@/utils/const';

interface WrongChainProps {
  blockchain: Blockchain;
}

export function WrongChain(props: WrongChainProps) {
  const { blockchain } = props;
  const { isMainnet } = useBridgeModeStore();
  const { currentProvider } = useAccountStore();

  let network = '';
  let transKey = '';
  if (currentProvider) {
    const providerName = currentProvider.name();
    if (blockchain === Blockchain.MASSA) {
      if (isMainnet) {
        network = 'Mainnet';
      } else {
        network = 'Buildnet';
      }
      if (providerName === SUPPORTED_MASSA_WALLETS.MASSASTATION) {
        transKey = 'index.tag.wrong-chain-massa-station-tooltip';
      } else if (
        blockchain === Blockchain.MASSA &&
        providerName === SUPPORTED_MASSA_WALLETS.BEARBY
      ) {
        transKey = 'index.tag.wrong-chain-bearby-tooltip';
      }
    } else if (blockchain === Blockchain.ETHEREUM) {
      transKey = 'connect-wallet.connect-metamask.invalid-network';
      if (isMainnet) {
        network = 'Mainnet';
      } else {
        network = 'Sepolia';
      }
    }
  }

  return (
    <Tag type={tagTypes.warning}>
      <div className="flex items-center">
        <span className="mr-1">{Intl.t('index.tag.wrong-chain')}</span>
        {currentProvider && (
          <Tooltip
            className="w-fit p-0 hover:cursor-pointer"
            customClass="p-0 mas-caption w-fit whitespace-nowrap"
            content={Intl.t(transKey, { network })}
            icon={<FiHelpCircle className="text-s-warning" />}
          />
        )}
      </div>
    </Tag>
  );
}
