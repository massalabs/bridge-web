import { ReactNode } from 'react';
import { MAINNET, BUILDNET } from '@massalabs/massa-web3';
import { MassaLogo } from '@massalabs/react-ui-kit';
import { EVMHeader } from './BoxLayoutComponents/EvmBoxComponents';
import { MassaHeader } from './BoxLayoutComponents/MassaBoxComponents';
import { InputAmount } from '../../../../components/inputAmount/InputAmount';
import { MassaBuildnetLogo } from '@/assets/MassaBuildnetLogo';
import { useOperationStore } from '@/store/store';
import { SIDE } from '@/utils/const';

interface Layout {
  header: ReactNode;
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
        input: <InputAmount isInput={true} massaTokens={false} />,
      },
      down: {
        header: <EVMHeader />,
        input: <InputAmount isInput={false} massaTokens={true} />,
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        input: <InputAmount isInput={true} massaTokens={true} />,
      },
      down: {
        header: <MassaHeader />,
        input: <InputAmount isInput={false} massaTokens={false} />,
      },
    },
  };

  return layouts[side];
}
