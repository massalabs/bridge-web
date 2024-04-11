import { Dropdown } from '@massalabs/react-ui-kit';
import { USDCMassaSvg } from '@/assets/ETHUSDCSvg';
import { SepoliaDaiSvg } from '@/assets/SepoliaDaiSvg';
import { SepoliaUSDCSvg } from '@/assets/SepoliaUSDCSvg';
import { SepoliaWethSvg } from '@/assets/SepoliaWethSvg';
import { TDaiMassaSvg } from '@/assets/TDaiMassaSvg';
import { TDaiSvg } from '@/assets/TDaiSvg';
import { USDCSvg } from '@/assets/USDCSvg';
import { WEthMassaSvg } from '@/assets/WEthMassaSvg';
import { WEthSvg } from '@/assets/WEthSvg';
import { SupportedTokens } from '@/const';
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

  function getTokenIcons() {
    if (!nativeToken) {
      return {
        tDAI: <TDaiSvg />,
        WETH: <WEthSvg />,
        USDC: <USDCSvg />,
      };
    } else if (isMainnet) {
      return {
        tDAI: <TDaiMassaSvg />,
        WETH: <WEthMassaSvg />,
        USDC: <USDCMassaSvg />,
      };
    }
    return {
      tDAI: <SepoliaDaiSvg />,
      WETH: <SepoliaWethSvg />,
      USDC: <SepoliaUSDCSvg />,
    };
  }

  function getIcon(symbolEVM: string): JSX.Element {
    const icons = {
      tDAI: getTokenIcons().tDAI,
      WETH: getTokenIcons().WETH,
      USDC: getTokenIcons().USDC,
      DAI: getTokenIcons().tDAI,
    };
    return icons[symbolEVM as SupportedTokens];
  }

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={readOnlyDropdown}
      size="md"
      options={tokens.map((token: IToken) => {
        return {
          item: nativeToken ? token.symbol : token.symbolEVM,
          icon: getIcon(token.symbolEVM),
          onClick: () => setSelectedToken(token),
        };
      })}
    />
  );
}
