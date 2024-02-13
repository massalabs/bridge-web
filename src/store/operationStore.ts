import { ClaimState, ClaimSteps, SIDE } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

interface CurrentRedeemOperation {
  claimStep: ClaimSteps;
  inputOpId: string;
  signatures: string[];
}

export interface RedeemOperation extends RedeemOperationToClaim {
  status?: string;
  claimStatus?: ClaimState;
  outputTxId?: string;
}

export interface OperationStoreState {
  opToRedeem: RedeemOperation[];
  setOpToRedeem: (opToRedeem: RedeemOperation[]) => void;
  updateOpToRedeem: (opToRedeem: RedeemOperation) => void;
  updateOutputTx: (inputTx: string, outputTx: string) => void;
  updateState: (inputTx: string, state: string) => void;
  updateClaimStatus: (inputTx: string, claimStatus: ClaimState) => void;

  currentRedeemOperation?: CurrentRedeemOperation;
  setCurrentRedeemOperation: (op: CurrentRedeemOperation) => void;
  updateCurrentRedeemOperation: (op: Partial<CurrentRedeemOperation>) => void;

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

const operationStore = (
  set: (params: Partial<OperationStoreState>) => void,
  get: () => OperationStoreState,
) => ({
  opToRedeem: [],
  setOpToRedeem: (opToRedeem: RedeemOperation[]) => {
    const operations = opToRedeem.map((op) => {
      if (op.claimStatus === undefined) {
        return { ...op, claimStatus: ClaimState.INIT };
      }
      return op;
    });
    set({ opToRedeem: operations });
  },

  updateOpToRedeem(opToRedeem: RedeemOperation) {
    set({ opToRedeem: [...get().opToRedeem, opToRedeem] });
  },

  updateOutputTx(inputTx: string, outputTx: string) {
    const updatedOps = get().opToRedeem.map((op) => {
      if (op.inputOpId === inputTx) {
        return { ...op, outputOpId: outputTx };
      }
      return op;
    });
    set({ opToRedeem: updatedOps });
  },

  updateState(inputTx: string, state: string) {
    const updatedOps = get().opToRedeem.map((op) => {
      if (op.inputOpId === inputTx) {
        return { ...op, state };
      }
      return op;
    });
    set({ opToRedeem: updatedOps });
  },

  updateClaimStatus(inputTx: string, claimStatus: ClaimState) {
    const updatedOps = get().opToRedeem.map((op) => {
      if (op.inputOpId === inputTx) {
        return { ...op, claimStatus };
      }
      return op;
    });
    set({ opToRedeem: updatedOps });
  },

  currentRedeemOperation: undefined,
  setCurrentRedeemOperation(op: CurrentRedeemOperation) {
    set({ currentRedeemOperation: op });
  },
  updateCurrentRedeemOperation(op: Partial<CurrentRedeemOperation>) {
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
