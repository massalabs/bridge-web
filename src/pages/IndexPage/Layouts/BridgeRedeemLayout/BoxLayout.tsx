import { ReactNode } from 'react';
import { MAINNET, BUILDNET } from '@massalabs/massa-web3';
import { MassaLogo } from '@massalabs/react-ui-kit';
import { EVMHeader, EVMMiddle } from './BoxLayoutComponents/EvmBoxComponents';
import {
  MassaHeader,
  MassaMiddle,
} from './BoxLayoutComponents/MassaBoxComponents';
import { InputAmount } from '../../../../components/inputAmount/inputAmount';
import { MassaBuildnetLogo } from '@/assets/MassaBuildnetLogo';
import { useOperationStore } from '@/store/store';
import { SIDE } from '@/utils/const';

interface Layout {
  header: ReactNode;
  wallet: ReactNode;
  input: ReactNode;
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

export function boxLayout(): BoxLayoutResult {
  const { side } = useOperationStore.getState();

  const layouts = {
    [SIDE.MASSA_TO_EVM]: {
      up: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        input: <InputAmount isInput={true} massaTokens={false} />,
      },
      down: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        input: <InputAmount isInput={false} massaTokens={true} />,
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        input: <InputAmount isInput={true} massaTokens={true} />,
      },
      down: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        input: <InputAmount isInput={false} massaTokens={false} />,
      },
    },
  };

  return layouts[side];
}
