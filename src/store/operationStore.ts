import { create } from 'zustand';
import {
  BurnState,
  ClaimState,
  LockState,
  MintState,
  SIDE,
} from '@/utils/const';

interface Operation {
  amount: string;
  emitter: string;
  recipient: string;
  inputId: string;
  outputId?: string;
  evmToken: `0x${string}`;
  massaToken: `AS${string}`;
}

export interface BurnRedeemOperation extends Operation {
  burnState?: BurnState;
  claimState: ClaimState;
  signatures: string[];
}

export interface LockMintOperation extends Operation {
  lockState?: LockState;
  mintState: MintState;
}

export interface OperationStoreState {
  burnOperations: BurnRedeemOperation[];
  setBurnRedeemOperations: (burnOperations: BurnRedeemOperation[]) => void;
  updateBurnRedeemOperationById: (
    inputOpId: string,
    op: Partial<BurnRedeemOperation>,
  ) => void;
  appendBurnRedeemOperation: (op: BurnRedeemOperation) => void;
  getBurnRedeemOperationById: (
    inputOpId: string,
  ) => BurnRedeemOperation | undefined;
  getCurrentRedeemOperation: () => BurnRedeemOperation | undefined;

  side: SIDE;
  setSide(side: SIDE): void;

  isMassaToEvm(): boolean;

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
    burnOperations: [],
    setBurnRedeemOperations: (newOps: BurnRedeemOperation[]) => {
      const oldOps = get().burnOperations;
      for (let newOp of newOps) {
        for (let oldOp of oldOps) {
          if (newOp.inputId === oldOp.inputId) {
            if (
              oldOp.claimState === ClaimState.AWAITING_SIGNATURE ||
              oldOp.claimState === ClaimState.PENDING ||
              oldOp.claimState === ClaimState.REJECTED
            ) {
              // Keep the old claim step because the lambda can't know all the UI states
              newOp.claimState = oldOp.claimState;
            }
          }
        }
      }

      set({ burnOperations: newOps });
    },
    updateBurnRedeemOperationById: (
      inputOpId: string,
      op: Partial<BurnRedeemOperation>,
    ) => {
      const burnOperations = get().burnOperations;
      const index = burnOperations.findIndex((op) => op.inputId === inputOpId);
      if (index !== -1) {
        const newOp = { ...burnOperations[index], ...op };
        burnOperations[index] = newOp;
        set({ burnOperations });
      }
    },
    appendBurnRedeemOperation: (op: BurnRedeemOperation) => {
      set({ burnOperations: [...get().burnOperations, op] });
    },
    getBurnRedeemOperationById: (inputOpId: string) => {
      return get().burnOperations.find((op) => op.inputId === inputOpId);
    },
    getCurrentRedeemOperation: () => {
      return get().getBurnRedeemOperationById(get().burnTxId || '');
    },

    isMassaToEvm: () => get().side === SIDE.MASSA_TO_EVM,

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
