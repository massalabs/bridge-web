import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { LoadingBoxProps } from './LoadingLayout';
import { Blockchain, METAMASK } from '@/const';
import { faqURL } from '@/const/faq';
import Intl from '@/i18n/i18n';
import {
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { SIDE } from '@/utils/const';
import { formatAmountToDisplay } from '@/utils/parseAmount';

export function SuccessLayout(props: LoadingBoxProps) {
  const { onClose } = props;
  const { side } = useOperationStore();
  const massaToEvm = side === SIDE.MASSA_TO_EVM;

  const { selectedToken: token } = useTokenStore();
  const { amount } = useOperationStore();

  const { isMainnet } = useBridgeModeStore();
  const { chain } = useAccount();
  if (!chain || !token || !amount) return null;

  const { in2decimals } = formatAmountToDisplay(amount, token);

  const massaChainAndNetwork = `${Blockchain.MASSA} ${
    isMainnet ? Blockchain.MASSA_MAINNET : Blockchain.MASSA_BUILDNET
  }`;

  const evmChainAndNetwork = `${chain.name} ${
    isMainnet ? Blockchain.EVM_MAINNET : Blockchain.EVM_TESTNET
  }`;

  const emitter = massaToEvm ? massaChainAndNetwork : evmChainAndNetwork;
  const recipient = massaToEvm ? evmChainAndNetwork : massaChainAndNetwork;

  return (
    <div className="flex flex-col gap-6 mas-body2 text-center">
      <div className="mb-1">
        {massaToEvm
          ? Intl.t('index.loading-box.redeemed')
          : Intl.t('index.loading-box.bridged')}
        <div className="mas-subtitle p-2">
          {in2decimals} {massaToEvm ? token.symbol : token.symbolEVM}
        </div>
        <div>
          {Intl.t('index.loading-box.from-to', {
            from: emitter,
            to: recipient,
          })}
        </div>
      </div>

      <hr
        className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r 
        from-transparent via-tertiary to-transparent opacity-100"
      />
      <p className="mb-1">
        {Intl.t('index.loading-box.check', {
          name: massaToEvm ? METAMASK : Blockchain.MASSA,
        })}
      </p>

      {!massaToEvm && (
        <div>
          <div className="mb-1">
            {Intl.t('index.loading-box.add-tokens-message')}
          </div>
          {/* this maybe need to be changed for FAQ mainnet */}
          <Link
            onClick={onClose}
            to={{
              search: massaToEvm
                ? faqURL.addTokens.addToMetamask
                : faqURL.addTokens.addToMassa,
            }}
          >
            <u>{Intl.t('index.loading-box.link-to-instructions')}</u>
          </Link>
        </div>
      )}
    </div>
  );
}
