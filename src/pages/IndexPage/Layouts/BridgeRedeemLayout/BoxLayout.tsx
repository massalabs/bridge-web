import { ReactNode } from 'react';
import { MAINNET, BUILDNET } from '@massalabs/massa-web3';
import { MassaLogo } from '@massalabs/react-ui-kit';
import { EVMHeader, EVMMiddle } from './BoxLayoutComponents/EvmBoxComponents';
import {
  MassaHeader,
  MassaMiddle,
} from './BoxLayoutComponents/MassaBoxComponents';
import { TokenBalance } from './BoxLayoutComponents/TokenBalance';
import { TokenOptions } from './BoxLayoutComponents/TokenOptions';
import { MassaBuildnetLogo } from '@/assets/MassaBuildnetLogo';
import { ServiceFeeToolip } from '@/components/ServiceFeeTooltip/ServiceFeeTooltip';
import { useOperationStore, useTokenStore } from '@/store/store';
import { SIDE } from '@/utils/const';
import { serviceFeeToPercent } from '@/utils/utils';

interface Layout {
  header: ReactNode;
  wallet: ReactNode;
  token: ReactNode;
  balance: ReactNode;
  receive?: ReactNode;
}

interface MassaIconsNetworks {
  [key: string]: JSX.Element;
}
export const massaIconsNetworks: MassaIconsNetworks = {
  [MAINNET]: <MassaLogo size={32} />,
  [BUILDNET]: <MassaBuildnetLogo size={32} />,
};

interface BoxLayoutResult {
  up: Layout;
  down: Layout;
}

// should refactor this function
export function boxLayout(serviceFee: bigint): BoxLayoutResult {
  const { side, outputAmount, inputAmount } = useOperationStore.getState();
  const { selectedToken } = useTokenStore.getState();

  const layouts = {
    [SIDE.MASSA_TO_EVM]: {
      up: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <TokenOptions nativeToken={false} />,
        balance: <TokenBalance />,
      },
      down: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions nativeToken={true} />,
        balance: null,
        receive: (
          <ServiceFeeToolip
            input={inputAmount}
            serviceFee={serviceFeeToPercent(serviceFee)}
            output={outputAmount}
            symbol={selectedToken?.symbol || ''}
          />
        ),
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions nativeToken={true} />,
        balance: <TokenBalance />,
      },
      down: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <TokenOptions nativeToken={false} />,
        balance: null,
      },
    },
  };

  return layouts[side];
}
