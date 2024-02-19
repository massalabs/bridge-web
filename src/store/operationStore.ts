import { create } from 'zustand';
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

  getCurrentSide(): boolean;

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

export const useOperationStore = create<OperationStoreState>(
  (
    set: (params: Partial<OperationStoreState>) => void,
    get: () => OperationStoreState,
  ) => ({
    opToRedeem: [],
    setOpToRedeem: (newOps: RedeemOperation[]) => {
      const oldOps = get().opToRedeem;
      for (let i = 0; i < newOps.length; i++) {
        for (let j = 0; j < oldOps.length; j++) {
          if (newOps[i].inputOpId === oldOps[j].inputOpId) {
            if (
              oldOps[j].claimState === ClaimState.AWAITING_SIGNATURE ||
              oldOps[j].claimState === ClaimState.PENDING ||
              oldOps[j].claimState === ClaimState.REJECTED
            ) {
              // Keep the old claim step because the lambda can't know all the UI states
              newOps[i].claimState = oldOps[j].claimState;
            }
          }
        }
      }

      set({ opToRedeem: newOps });
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

    getCurrentSide: () => get().side === SIDE.MASSA_TO_EVM,
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
  }),
);
