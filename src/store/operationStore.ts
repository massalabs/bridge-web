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
  pushNewOpToRedeem: (op: RedeemOperation) => void;
  getOpToRedeemByInputOpId: (inputOpId: string) => RedeemOperation | undefined;
  getCurrentRedeemOperation: () => RedeemOperation | undefined;

  side: SIDE;
  setSide(side: SIDE): void;

  lockTxId?: string;
  setLockTxId(currentTxID?: string): void;

  mintTxId?: string;
  setMintTxId(currentTxID?: string): void;

  burnTxId?: string;
  setBurnTxId(currentTxID?: string): void;

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
  pushNewOpToRedeem: (op: RedeemOperation) => {
    set({ opToRedeem: [...get().opToRedeem, op] });
  },
  getOpToRedeemByInputOpId: (inputOpId: string) => {
    return get().opToRedeem.find((op) => op.inputOpId === inputOpId);
  },
  getCurrentRedeemOperation: () => {
    return get().getOpToRedeemByInputOpId(get().burnTxId || '');
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

  amount: undefined,
  setAmount(amount?: string) {
    set({ amount });
  },

  resetTxIDs: () => {
    set({
      lockTxId: undefined,
      mintTxId: undefined,
      burnTxId: undefined,
      amount: undefined,
    });
  },
});

export default operationStore;
