import { SIDE } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export interface OperationStoreState {
  opToRedeem: RedeemOperationToClaim[];
  setOpToRedeem: (operationsToRedeem: RedeemOperationToClaim[]) => void;

  side: SIDE;
  setSide(side: SIDE): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const operationStore = (
  set: (params: Partial<OperationStoreState>) => void,
  _get: () => OperationStoreState,
) => ({
  opToRedeem: [],
  setOpToRedeem: (operationsToRedeem: RedeemOperationToClaim[]) =>
    set({ opToRedeem: operationsToRedeem }),

  side: SIDE.MASSA_TO_EVM,
  setSide(side: SIDE) {
    set({ side });
  },
});

export default operationStore;
