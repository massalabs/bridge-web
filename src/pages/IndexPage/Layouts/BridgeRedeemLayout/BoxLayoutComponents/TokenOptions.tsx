import { Dropdown, getAssetIcons } from '@massalabs/react-ui-kit';
import { useGetTargetEvmChainId } from '@/custom/bridge/useNetworkValidation';
import { useAccountStore } from '@/store/store';
import { useTokenStore, IToken } from '@/store/tokenStore';

interface TokenOptionsProps {
  nativeToken: boolean;
}

export function TokenOptions(props: TokenOptionsProps) {
  const { nativeToken } = props;
  const { isFetching } = useAccountStore();
  const { getTokens, setSelectedToken, selectedToken } = useTokenStore();
  const tokens = getTokens();
  const targetChainId = useGetTargetEvmChainId();

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name === selectedToken?.name,
    ) || '0',
  );

  const readOnlyDropdown = isFetching;

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={readOnlyDropdown}
      size="md"
      options={tokens.map((token: IToken) => {
        return {
          item: nativeToken ? token.symbolEVM : token.symbol,
          icon: getAssetIcons(token.symbolEVM, targetChainId, nativeToken),
          onClick: () => setSelectedToken(token),
        };
      })}
    />
  );
}
