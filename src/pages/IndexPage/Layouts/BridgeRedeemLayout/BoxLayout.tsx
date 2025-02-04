import { ReactNode } from 'react';
import { MAINNET, BUILDNET } from '@massalabs/massa-web3';
import { MassaLogo } from '@massalabs/react-ui-kit';

import { MassaBuildnetLogo } from '@/assets/MassaBuildnetLogo';
import { InputAmount } from '@/components/inputAmount/InputAmount';
import { EVMHeader, MassaHeader } from '@/pages';
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
        input: <InputAmount isInput={true} EVMToken={false} />,
      },
      down: {
        header: <EVMHeader />,
        input: <InputAmount isInput={false} EVMToken={true} />,
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        input: <InputAmount isInput={true} EVMToken={true} />,
      },
      down: {
        header: <MassaHeader />,
        input: <InputAmount isInput={false} EVMToken={false} />,
      },
    },
  };

  return layouts[side];
}
