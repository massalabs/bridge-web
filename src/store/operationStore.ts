import { create } from 'zustand';
import { SupportedEvmBlockchain } from '@/const';
import { BurnState, ClaimState, SIDE } from '@/utils/const';
import { OperationHistoryItem } from '@/utils/lambdaApi';
import { _setInStorage } from '@/utils/storage';

export const SELECTED_EVM_STORAGE_KEY = 'selectedEvm';

export interface BurnRedeemOperation extends OperationHistoryItem {
  claimState: ClaimState;
}

export interface OperationStoreState {
  burnRedeemOperations: BurnRedeemOperation[];
  setBurnRedeemOperations: (
    burnRedeemOperations: BurnRedeemOperation[],
  ) => void;
  updateBurnRedeemOperationById: (
    inputOpId: string,
    op: Partial<BurnRedeemOperation>,
  ) => void;
  appendBurnRedeemOperation: (op: BurnRedeemOperation) => void;
  getBurnRedeemOperationById: (
    inputOpId: string,
  ) => BurnRedeemOperation | undefined;
  getCurrentRedeemOperation: () => BurnRedeemOperation | undefined;

  burnState: BurnState;
  setBurnState: (burnState: BurnState) => void;

  side: SIDE;
  setSide(side: SIDE): void;

  isMassaToEvm(): boolean;

  availableEvmNetworks: SupportedEvmBlockchain[];
  selectedEvm: SupportedEvmBlockchain;
  setSelectedEvm(selectedEvm: SupportedEvmBlockchain): void;

  lockTxId?: string;
  setLockTxId(currentTxID?: string): void;

  mintTxId?: string;
  setMintTxId(currentTxID?: string): void;

  burnTxId?: string;
  setBurnTxId(currentTxID?: string): void;

  claimTxId?: string;
  setClaimTxId(currentTxID?: string): void;

  inputAmount?: bigint;
  setInputAmount(amount?: bigint): void;

  outputAmount?: string;
  setOutputAmount(amount?: string): void;

  resetTxIDs: () => void;
}

export const useOperationStore = create<OperationStoreState>(
  (
    set: (params: Partial<OperationStoreState>) => void,
    get: () => OperationStoreState,
  ) => ({
    burnRedeemOperations: [],
    setBurnRedeemOperations: (newOps: BurnRedeemOperation[]) => {
      const oldOps = get().burnRedeemOperations;
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

      set({ burnRedeemOperations: newOps });
    },
    updateBurnRedeemOperationById: (
      inputOpId: string,
      op: Partial<BurnRedeemOperation>,
    ) => {
      const burnRedeemOperations = get().burnRedeemOperations;
      const index = burnRedeemOperations.findIndex(
        (op) => op.inputId === inputOpId,
      );
      if (index !== -1) {
        const newOp = { ...burnRedeemOperations[index], ...op };
        burnRedeemOperations[index] = newOp;
        set({ burnRedeemOperations });
      }
    },
    appendBurnRedeemOperation: (op: BurnRedeemOperation) => {
      set({ burnRedeemOperations: [...get().burnRedeemOperations, op] });
    },
    getBurnRedeemOperationById: (inputOpId: string) => {
      return get().burnRedeemOperations.find((op) => op.inputId === inputOpId);
    },
    getCurrentRedeemOperation: () => {
      return get().getBurnRedeemOperationById(get().burnTxId || '');
    },

    isMassaToEvm: () => get().side === SIDE.MASSA_TO_EVM,

    availableEvmNetworks: Object.values(SupportedEvmBlockchain),
    selectedEvm: SupportedEvmBlockchain.ETH,
    setSelectedEvm(selectedEvm: SupportedEvmBlockchain) {
      _setInStorage(SELECTED_EVM_STORAGE_KEY, JSON.stringify(selectedEvm));
      set({ selectedEvm });
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

    burnState: BurnState.INIT,
    setBurnState(burnState: BurnState) {
      set({ burnState });
    },

    burnTxId: undefined,
    setBurnTxId(burnTxId?: string) {
      set({ burnTxId });
    },

    claimTxId: undefined,
    setClaimTxId(claimTxId?: string) {
      set({ claimTxId });
    },

    inputAmount: undefined,
    setInputAmount(amount?: bigint) {
      set({ inputAmount: amount });
    },

    outputAmount: undefined,
    setOutputAmount(amount?: string) {
      set({ outputAmount: amount });
    },

    resetTxIDs: () => {
      set({
        lockTxId: undefined,
        mintTxId: undefined,
        burnTxId: undefined,
        inputAmount: undefined,
        outputAmount: undefined,
      });
    },
  }),
);
