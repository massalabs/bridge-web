import { SIDE } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export interface OperationStoreState {
  opToRedeem: RedeemOperationToClaim[];
  setOpToRedeem: (operationsToRedeem: RedeemOperationToClaim[]) => void;

  side: SIDE;
  setSide(side: SIDE): void;

  burnTxID: string;
  setBurnTxID(txID: string): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const operationStore = (
  set: (params: Partial<OperationStoreState>) => void,
  _get: () => OperationStoreState,
) => ({
  opToRedeem: [],
  setOpToRedeem: (operationsToRedeem: RedeemOperationToClaim[]) =>
    set({ opToRedeem: operationsToRedeem }),

  side: SIDE.EVM_TO_MASSA,
  setSide(side: SIDE) {
    set({ side });
  },

  burnTxID: '',
  setBurnTxID(txID: string) {
    set({ burnTxID: txID });
  },
});

export default operationStore;
