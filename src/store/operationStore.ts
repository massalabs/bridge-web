import { ClaimState, SIDE } from '@/utils/const';

export interface RedeemOperation {
  claimState: ClaimState;
  amount: string;
  recipient: `0x${string}`;
  inputOpId: string;
  signatures: string[];
  outputTxId?: string;
  evmToken: `0x${string}`;
}

export interface OperationStoreState {
  opToRedeem: RedeemOperation[];
  setOpToRedeem: (opToRedeem: RedeemOperation[]) => void;
  updateOpToRedeemByInputOpId: (
    inputOpId: string,
    op: Partial<RedeemOperation>,
  ) => void;

  currentRedeemOperation?: RedeemOperation;
  setCurrentRedeemOperation: (op: RedeemOperation) => void;
  updateCurrentRedeemOperation: (op: Partial<RedeemOperation>) => void;

  side: SIDE;
  setSide(side: SIDE): void;

  lockTxId?: string;
  setLockTxId(currentTxID?: string): void;

  mintTxId?: string;
  setMintTxId(currentTxID?: string): void;

  claimTxId?: string; // TODO: remove it, use currentRedeemOperation.outputOpId
  setClaimTxId(currentTxID?: string): void;

  amount?: string;
  setAmount(amount?: string): void;

  resetTxIDs: () => void;
}

const operationStore = (
  set: (params: Partial<OperationStoreState>) => void,
  get: () => OperationStoreState,
) => ({
  opToRedeem: [],
  setOpToRedeem: (opToRedeem: RedeemOperation[]) => {
    set({ opToRedeem });

    // Update currentRedeemOperation
    if (opToRedeem.length) {
      const op = opToRedeem.find(
        (operation) =>
          operation.inputOpId === get().currentRedeemOperation?.inputOpId,
      );
      if (op && op.outputTxId) {
        get().updateCurrentRedeemOperation({
          claimState: ClaimState.SUCCESS,
        });
      }
    }
  },
  updateOpToRedeemByInputOpId: (
    inputOpId: string,
    op: Partial<RedeemOperation>,
  ) => {
    const opToRedeem = get().opToRedeem;
    const index = opToRedeem.findIndex((op) => op.inputOpId === inputOpId);
    if (index !== -1) {
      const newOp = { ...opToRedeem[index], ...op };
      opToRedeem[index] = newOp;
      set({ opToRedeem });
    }
  },

  currentRedeemOperation: undefined,
  setCurrentRedeemOperation(op: RedeemOperation) {
    set({ currentRedeemOperation: op });
  },
  updateCurrentRedeemOperation(op: Partial<RedeemOperation>) {
    const currentOp = get().currentRedeemOperation;
    if (currentOp) {
      set({ currentRedeemOperation: { ...currentOp, ...op } });
    }
  },

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
      claimTxId: undefined,
      amount: undefined,
    });
  },
});

export default operationStore;
