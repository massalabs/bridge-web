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
import { BNBSvg } from '@/assets/BNBSvg';
import { EthSvg } from '@/assets/EthSvg';
import { MassaBuildnetLogo } from '@/assets/MassaBuildnetLogo';
import { SepoliaSvg } from '@/assets/SepoliaSVG';
import { useOperationStore } from '@/store/store';
import { SIDE } from '@/utils/const';

interface Layout {
  header: ReactNode;
  wallet: ReactNode;
  token: ReactNode;
  balance: ReactNode;
}

interface IconsNetworks {
  [key: string]: JSX.Element;
}
export const iconsNetworks: IconsNetworks = {
  [MAINNET]: <MassaLogo size={40} />,
  [BUILDNET]: <MassaBuildnetLogo size={40} />,
  ETH: <EthSvg size={40} />,
  SEP: <SepoliaSvg size={40} />,
  BSC: <BNBSvg size={40} />,
  TBSC: <BNBSvg size={40} />,
};

interface BoxLayoutResult {
  up: Layout;
  down: Layout;
}

export function boxLayout(): BoxLayoutResult {
  const { side } = useOperationStore.getState();

  const layouts = {
    [SIDE.MASSA_TO_EVM]: {
      up: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <TokenOptions nativeToken={true} />,
        balance: <TokenBalance />,
      },
      down: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions nativeToken={false} />,
        balance: null,
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions nativeToken={false} />,
        balance: <TokenBalance />,
      },
      down: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <TokenOptions nativeToken={true} />,
        balance: null,
      },
    },
  };

  return layouts[side];
}
