import { Dropdown, getAssetIcons } from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';
import { useOperationStore } from '@/store/operationStore';
import { useBridgeModeStore, useAccountStore } from '@/store/store';
import { useTokenStore, IToken } from '@/store/tokenStore';

interface TokenOptionsProps {
  nativeToken: boolean;
}

export function TokenOptions(props: TokenOptionsProps) {
  const { nativeToken } = props;
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { isMassaToEvm: getIsMassaToEvm } = useOperationStore();
  const { isFetching } = useAccountStore();
  const { tokens, setSelectedToken, selectedToken } = useTokenStore();
  const { chain } = useAccount();

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name === selectedToken?.name,
    ) || '0',
  );

  const isMainnet = getIsMainnet();
  const isMassaToEvm = getIsMassaToEvm();

  let readOnlyDropdown;
  if (isMassaToEvm) {
    readOnlyDropdown = !isMassaToEvm || isFetching;
  } else {
    readOnlyDropdown = isMassaToEvm || isFetching;
  }

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={readOnlyDropdown}
      size="md"
      options={tokens
        .filter((t) => t.chainId === chain?.id)
        .map((token: IToken) => {
          return {
            item: nativeToken ? token.symbol : token.symbolEVM,
            icon: getAssetIcons(token.symbolEVM, nativeToken, isMainnet),
            onClick: () => setSelectedToken(token),
          };
        })}
    />
  );
}
