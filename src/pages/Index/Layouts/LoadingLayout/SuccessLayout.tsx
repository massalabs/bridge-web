import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { LoadingBoxProps } from './PendingOperationLayout';
import { ShowLinkToExplorers } from './ShowLinkToExplorers';
import { Blockchain, METAMASK } from '@/const';
import { faqURL } from '@/const/faq';
import Intl from '@/i18n/i18n';
import {
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import {
  EVM_EXPLORER,
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLO_URL,
  SIDE,
} from '@/utils/const';
import { formatAmountToDisplay } from '@/utils/parseAmount';

export function SuccessLayout(props: LoadingBoxProps) {
  const { onClose } = props;
  const { side, mintTxId, getCurrentRedeemOperation, amount } =
    useOperationStore();
  const { currentMode, isMainnet } = useBridgeModeStore();
  const { chain } = useAccount();
  const { selectedToken: token } = useTokenStore();

  if (!chain || !token || !amount) return null;

  const massaToEvm = side === SIDE.MASSA_TO_EVM;
  const currentRedeemOperation = getCurrentRedeemOperation();
  const { amountFormattedPreview } = formatAmountToDisplay(amount, token);

  const massaChainAndNetwork = `${Blockchain.MASSA} ${
    isMainnet ? Blockchain.MASSA_MAINNET : Blockchain.MASSA_BUILDNET
  }`;

  const evmChainAndNetwork = `${chain.name} ${
    isMainnet ? Blockchain.EVM_MAINNET : Blockchain.EVM_TESTNET
  }`;

  // claim && bridge success need to show respective show link to explorer
  const explorerUrl = massaToEvm
    ? `${EVM_EXPLORER[currentMode]}tx/${currentRedeemOperation?.outputTxId}`
    : isMainnet
    ? `${MASSA_EXPLORER_URL}${mintTxId}`
    : `${MASSA_EXPLO_URL}${mintTxId}${MASSA_EXPLO_EXTENSION}`;

  const emitter = massaToEvm ? massaChainAndNetwork : evmChainAndNetwork;
  const recipient = massaToEvm ? evmChainAndNetwork : massaChainAndNetwork;

  const currentTxID = massaToEvm
    ? currentRedeemOperation?.outputTxId
    : mintTxId;

  return (
    <div className="flex flex-col gap-6 mas-body2 text-center">
      <div className="mb-1">
        {massaToEvm
          ? Intl.t('index.loading-box.redeemed')
          : Intl.t('index.loading-box.bridged')}
        <div className="mas-subtitle p-2">
          {amountFormattedPreview} {massaToEvm ? token.symbol : token.symbolEVM}
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
          {/* this may need to be changed for FAQ mainnet */}
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
      <ShowLinkToExplorers
        explorerUrl={explorerUrl}
        currentTxID={currentTxID}
      />
    </div>
  );
}
