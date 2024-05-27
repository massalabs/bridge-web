import { Dropdown, getAssetIcons } from '@massalabs/react-ui-kit';
import { useBridgeModeStore, useAccountStore } from '@/store/store';
import { useTokenStore, IToken } from '@/store/tokenStore';

interface TokenOptionsProps {
  nativeToken: boolean;
}

export function TokenOptions(props: TokenOptionsProps) {
  const { nativeToken } = props;
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { isFetching } = useAccountStore();
  const { getTokens, setSelectedToken, selectedToken } = useTokenStore();

  const tokens = getTokens();

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name === selectedToken?.name,
    ) || '0',
  );

  const isMainnet = getIsMainnet();

  const readOnlyDropdown = isFetching;

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={readOnlyDropdown}
      size="md"
      options={tokens.map((token: IToken) => {
        return {
          item: nativeToken ? token.symbol : token.symbolEVM,
          icon: getAssetIcons(token.symbolEVM, nativeToken, isMainnet),
          onClick: () => setSelectedToken(token),
        };
      })}
    />
  );
}
