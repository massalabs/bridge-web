import { SIDE } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export interface OperationStoreState {
  opToRedeem: RedeemOperationToClaim[];
  setOpToRedeem: (opToRedeem: RedeemOperationToClaim[]) => void;

  side: SIDE;
  setSide(side: SIDE): void;

  lockTxId?: string;
  setLockTxId(currentTxID?: string): void;

  mintTxId?: string;
  setMintTxId(currentTxID?: string): void;

  burnTxId?: string;
  setBurnTxId(currentTxID?: string): void;

  claimTxId?: string;
  setClaimTxId(currentTxID?: string): void;

  amount?: string;
  setAmount(amount?: string): void;

  resetTxIDs: () => void;
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

  lockTxId: undefined,
  setLockTxId(lockTxId?: string) {
    set({ lockTxId });
  },

  mintTxId: undefined,
  setMintTxId(mintTxId?: string) {
    set({ mintTxId });
  },

  burnTxId: undefined,
  setBurnTxId(burnTxId?: string) {
    set({ burnTxId });
  },

  claimTxId: undefined,
  setClaimTxId(claimTxId?: string) {
    set({ claimTxId });
  },

  amount: undefined,
  setAmount(amount?: string) {
    set({ amount });
  },

  resetTxIDs: () => {
    set({
      lockTxId: undefined,
      mintTxId: undefined,
      burnTxId: undefined,
      claimTxId: undefined,
      amount: undefined,
    });
  },
});

export default operationStore;
