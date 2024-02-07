import { SIDE } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export interface OperationStoreState {
  opToRedeem: RedeemOperationToClaim[];
  setOpToRedeem: (opToRedeem: RedeemOperationToClaim[]) => void;

  side: SIDE;
  setSide(side: SIDE): void;

  currentTxID?: string;
  setCurrentTxID(currentTxID?: string): void;

  amount?: string;
  setAmount(amount?: string): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const operationStore = (
  set: (params: Partial<OperationStoreState>) => void,
  _get: () => OperationStoreState,
) => ({
  opToRedeem: [],
  setOpToRedeem: (opToRedeem: RedeemOperationToClaim[]) => set({ opToRedeem }),

  side: SIDE.EVM_TO_MASSA,
  setSide(side: SIDE) {
    set({ side });
  },

  currentTxID: undefined,
  setCurrentTxID(currentTxID?: string) {
    set({ currentTxID });
  },

  amount: undefined,
  setAmount(amount?: string) {
    set({ amount });
  },
});

export default operationStore;
